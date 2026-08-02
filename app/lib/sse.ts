import { getAccessToken, http } from "~/lib/api";

export type SseEvent = { type: string; data: string };

type Handlers = {
  onEvent?: (event: SseEvent) => void;
  onError?: (err: unknown) => void;
};

/** SSE 프레임(빈 줄로 구분된 블록) 하나를 파싱한다. 주석(:)·미인식 필드는 무시. */
function parseFrame(raw: string): SseEvent | null {
  let type = "message";
  const dataLines: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    if (!line || line.startsWith(":")) continue;
    const colon = line.indexOf(":");
    const field = colon === -1 ? line : line.slice(0, colon);
    const value = colon === -1 ? "" : line.slice(colon + 1).replace(/^ /, "");
    if (field === "event") type = value;
    else if (field === "data") dataLines.push(value);
  }
  if (dataLines.length === 0 && type === "message") return null;
  return { type, data: dataLines.join("\n") };
}

/** 재연결 백오프: 1s → 2s → 4s … 최대 30s. */
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;
/**
 * 이 시간 이상 유지된 연결만 "정상"으로 보고 백오프를 초기화한다.
 * 연결 수립 자체를 기준으로 삼으면, 서버가 받자마자 끊는 상황에서 백오프가 자라지 않아
 * 최소 간격으로 무한 재연결하게 된다.
 */
const STABLE_MS = 10_000;

/**
 * fetch 기반 SSE 구독. 브라우저 기본 `EventSource`는 Authorization 헤더를 실을 수 없어
 * 인증이 필요한 스트림에는 쓸 수 없으므로 fetch + ReadableStream으로 직접 파싱한다.
 * 스트림이 끊기면 백오프를 두고 자동 재연결한다.
 * 반환된 함수를 호출하면 구독을 중단한다.
 */
export function subscribeSse(path: string, handlers: Handlers): () => void {
  let closed = false;
  // 재연결마다 새 컨트롤러가 필요하다(abort된 시그널은 재사용할 수 없다).
  let controller = new AbortController();
  let wakeUp: (() => void) | null = null;
  const url = `${http.defaults.baseURL ?? ""}${path}`;

  /** 구독 해제 시 즉시 깨어나는 취소 가능한 대기. */
  function delay(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const timer = setTimeout(resolve, ms);
      wakeUp = () => {
        clearTimeout(timer);
        resolve();
      };
    });
  }

  (async () => {
    let attempt = 0;
    while (!closed) {
      let openedAt = 0;
      try {
        controller = new AbortController();
        const token = getAccessToken();
        const res = await fetch(url, {
          headers: {
            Accept: "text/event-stream",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });
        // 인증 실패는 재연결해도 같은 결과이므로 재로그인까지 중단한다.
        if (res.status === 401 || res.status === 403) {
          handlers.onError?.(new Error(`SSE 인증 실패 (${res.status})`));
          return;
        }
        if (!res.ok || !res.body) throw new Error(`SSE 연결 실패 (${res.status})`);

        openedAt = Date.now();
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (!closed) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          let idx: number;
          while ((idx = buffer.indexOf("\n\n")) !== -1) {
            const frame = parseFrame(buffer.slice(0, idx));
            buffer = buffer.slice(idx + 2);
            if (frame) handlers.onEvent?.(frame);
          }
        }
      } catch (err) {
        if (closed || (err instanceof DOMException && err.name === "AbortError"))
          return;
        handlers.onError?.(err);
      }
      // 여기 도달 = 스트림이 끊겼다(서버 정상 종료 포함). 백오프 후 재연결한다.
      if (closed) return;
      if (openedAt && Date.now() - openedAt >= STABLE_MS) attempt = 0;
      await delay(Math.min(RECONNECT_BASE_MS * 2 ** attempt++, RECONNECT_MAX_MS));
    }
  })();

  return () => {
    closed = true;
    wakeUp?.();
    controller.abort();
  };
}

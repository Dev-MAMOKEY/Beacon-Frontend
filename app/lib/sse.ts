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

/**
 * fetch 기반 SSE 구독. 브라우저 기본 `EventSource`는 Authorization 헤더를 실을 수 없어
 * 인증이 필요한 스트림에는 쓸 수 없으므로 fetch + ReadableStream으로 직접 파싱한다.
 * 반환된 함수를 호출하면 구독을 중단한다.
 */
export function subscribeSse(path: string, handlers: Handlers): () => void {
  const controller = new AbortController();
  let closed = false;
  const url = `${http.defaults.baseURL ?? ""}${path}`;

  (async () => {
    try {
      const token = getAccessToken();
      const res = await fetch(url, {
        headers: {
          Accept: "text/event-stream",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`SSE 연결 실패 (${res.status})`);

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
      if (!closed && !(err instanceof DOMException && err.name === "AbortError"))
        handlers.onError?.(err);
    }
  })();

  return () => {
    closed = true;
    controller.abort();
  };
}

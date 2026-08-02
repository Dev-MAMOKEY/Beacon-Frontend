import { useEffect, useRef, useState } from "react";
import { SettingsField } from "./SettingsField";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, beaconApi, type BeaconConfigDto } from "~/lib/api";

/** rssiThreshold 허용 범위(BeaconConfigDto). -90=먼 신호, -40=가까운 신호. */
const RSSI_MIN = -90;
const RSSI_MAX = -40;

/** 입력이 멎고 이 시간이 지나면 저장한다. 슬라이더 드래그 중엔 매번 타이머가 갱신된다. */
const AUTOSAVE_MS = 600;

/** 임계값을 게이지 채움 비율(0~100)로 변환한다. */
function toPercent(rssi: number): number {
  return ((rssi - RSSI_MIN) / (RSSI_MAX - RSSI_MIN)) * 100;
}

/**
 * UUID를 서버 저장 형식(하이픈 없는 소문자 32자리 hex)으로 정규화한다.
 * 시안 placeholder처럼 하이픈이 섞인 입력도 받아준다. 형식이 아니면 null.
 * 서버는 형식을 검증하지 않고 아무 문자열이나 받으므로 여기서 막아야 한다.
 */
function normalizeUuid(raw: string): string | null {
  const compact = raw.trim().replace(/-/g, "").toLowerCase();
  return /^[0-9a-f]{32}$/.test(compact) ? compact : null;
}

type Status =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "error"; message: string };

/**
 * 비콘 설정 카드. GET/PUT `/clubs/{clubId}/beacon` 연동.
 * Figma(356:2171): bg-surface, rounded-20, pl-34 pr-50 py-40, gap-30.
 * 좌측 UUID·RSSI 임계값 슬라이더 / 우측 패널(지각 기준·안정화 시간).
 * 시안에 저장 버튼이 없어 입력이 멎으면 자동 저장하고, 상태는 제목 우측에 표시한다.
 */
export function BeaconSettingsCard() {
  const { activeClubId } = useActiveClub();
  const [uuid, setUuid] = useState("");
  const [lateThreshold, setLateThreshold] = useState("");
  const [rssiStabilization, setRssiStabilization] = useState("");
  const [rssiThreshold, setRssiThreshold] = useState(RSSI_MIN);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // 서버에서 채운 값으로 인한 변경까지 저장하지 않도록, 사용자가 만진 뒤에만 true.
  const dirtyRef = useRef(false);
  const reqRef = useRef(0);

  // 활성 동아리의 비콘 설정을 조회해 폼에 채운다.
  useEffect(() => {
    if (activeClubId === null) return;
    let active = true;
    dirtyRef.current = false;
    setLoading(true);
    setStatus({ kind: "idle" });
    beaconApi
      .getBeaconConfig(activeClubId)
      .then((c) => {
        if (!active) return;
        setUuid(c.uuid ?? "");
        setLateThreshold(String(c.lateThresholdMinutes ?? ""));
        setRssiStabilization(String(c.rssiStabilizationSeconds ?? ""));
        setRssiThreshold(c.rssiThreshold ?? RSSI_MIN);
      })
      .catch((err) => {
        if (active)
          setStatus({
            kind: "error",
            message:
              err instanceof ApiError
                ? err.message
                : "비콘 설정을 불러오지 못했습니다.",
          });
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId]);

  // 입력이 멎으면 자동 저장(시안에 저장 버튼이 없다).
  useEffect(() => {
    if (activeClubId === null || !dirtyRef.current) return;

    const normalizedUuid = normalizeUuid(uuid);
    const minutes = Number(lateThreshold);
    const seconds = Number(rssiStabilization);

    if (!normalizedUuid) {
      setStatus({ kind: "error", message: "UUID는 32자리 16진수여야 합니다." });
      return;
    }
    if (!Number.isInteger(minutes) || minutes < 0) {
      setStatus({
        kind: "error",
        message: "지각 시간 기준은 0 이상의 정수여야 합니다.",
      });
      return;
    }
    if (!Number.isInteger(seconds) || seconds < 1) {
      setStatus({
        kind: "error",
        message: "RSSI 신호 안정화 시간은 1 이상의 정수여야 합니다.",
      });
      return;
    }

    const body: BeaconConfigDto = {
      uuid: normalizedUuid,
      lateThresholdMinutes: minutes,
      rssiStabilizationSeconds: seconds,
      rssiThreshold,
    };
    const clubId = activeClubId;
    const timer = setTimeout(async () => {
      const req = ++reqRef.current;
      setStatus({ kind: "saving" });
      try {
        await beaconApi.updateBeaconConfig(clubId, body);
        if (req === reqRef.current) setStatus({ kind: "saved" });
      } catch (err) {
        if (req !== reqRef.current) return;
        setStatus({
          kind: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "비콘 설정 저장에 실패했습니다.",
        });
      }
    }, AUTOSAVE_MS);

    return () => clearTimeout(timer);
  }, [activeClubId, uuid, lateThreshold, rssiStabilization, rssiThreshold]);

  /** 사용자 입력임을 표시해 자동 저장을 켠다. */
  function markDirty() {
    dirtyRef.current = true;
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-[30px] rounded-[20px] bg-surface py-[40px] pl-[34px] pr-[50px]">
      <div className="flex items-center justify-between gap-[16px]">
        <h2 className="text-[20px] font-semibold tracking-[0.25px] text-foreground-muted">
          비콘 설정
        </h2>
        <StatusText loading={loading} status={status} />
      </div>

      <div className="flex gap-[70px]">
        <div className="flex flex-col gap-[50px]">
          <SettingsField
            label="UUID"
            placeholder="e.g. FDA50693-A4E2-4FB1A4E2-4FB1"
            className="w-full"
            padding="px-[10px] py-[12px]"
            align="center"
            value={uuid}
            onChange={(e) => {
              markDirty();
              setUuid(e.target.value);
            }}
          />

          <div className="flex flex-col gap-[14px]">
            <span className="text-[18px] font-semibold text-foreground-subtle">
              RSSI
            </span>
            <span className="text-[28px] font-semibold text-primary-hover">
              {rssiThreshold}dBm
            </span>
            <div className="flex flex-col">
              <div className="relative flex h-[44px] w-[414px] items-center">
                {/* 투명한 range를 트랙 위에 겹쳐 드래그·키보드 조작을 그대로 살린다. */}
                <input
                  type="range"
                  min={RSSI_MIN}
                  max={RSSI_MAX}
                  step={1}
                  value={rssiThreshold}
                  onChange={(e) => {
                    markDirty();
                    setRssiThreshold(Number(e.target.value));
                  }}
                  aria-label="RSSI 임계값"
                  className="peer absolute inset-0 z-10 size-full cursor-pointer opacity-0"
                />
                <div className="h-[16px] w-full overflow-hidden rounded-full bg-border-subtle peer-focus-visible:ring-2 peer-focus-visible:ring-primary">
                  <div
                    className="h-full rounded-full bg-primary-hover"
                    style={{ width: `${toPercent(rssiThreshold)}%` }}
                  />
                </div>
              </div>
              <div className="flex w-[414px] justify-between text-[18px] font-medium text-foreground-subtle">
                <span>(먼)</span>
                <span>(가까운)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-[50px] rounded-[22px] bg-background p-[40px]">
          <SettingsField
            label="지각 시간 기준"
            placeholder="분"
            align="right"
            className="w-full"
            padding="px-[30px] py-[12px]"
            inputMode="numeric"
            value={lateThreshold}
            onChange={(e) => {
              markDirty();
              setLateThreshold(e.target.value);
            }}
          />
          <SettingsField
            label="RSSI 신호 안정화 시간"
            placeholder="초"
            align="right"
            className="w-full"
            padding="px-[30px] py-[12px]"
            inputMode="numeric"
            value={rssiStabilization}
            onChange={(e) => {
              markDirty();
              setRssiStabilization(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** 제목 우측 상태 문구. 저장 버튼이 없으므로 저장 여부를 여기서만 알린다. */
function StatusText({ loading, status }: { loading: boolean; status: Status }) {
  if (loading)
    return (
      <span className="text-[15px] font-medium text-foreground-subtle">
        불러오는 중...
      </span>
    );

  switch (status.kind) {
    case "saving":
      return (
        <span className="text-[15px] font-medium text-foreground-subtle">
          저장 중...
        </span>
      );
    case "saved":
      return (
        <span className="text-[15px] font-medium text-success">저장됨</span>
      );
    case "error":
      return (
        <span className="text-[15px] font-medium text-destructive">
          {status.message}
        </span>
      );
    default:
      return null;
  }
}

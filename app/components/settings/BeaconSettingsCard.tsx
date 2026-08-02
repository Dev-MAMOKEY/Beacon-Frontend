import { useEffect, useState } from "react";
import { SettingsField } from "./SettingsField";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, beaconApi, type BeaconConfigDto } from "~/lib/api";

/** rssiThreshold 허용 범위(BeaconConfigDto). -90=먼 신호, -40=가까운 신호. */
const RSSI_MIN = -90;
const RSSI_MAX = -40;

/** 임계값을 게이지 채움 비율(0~100)로 변환한다. */
function toPercent(rssi: number): number {
  return ((rssi - RSSI_MIN) / (RSSI_MAX - RSSI_MIN)) * 100;
}

/**
 * 비콘 설정 카드. GET/PUT `/clubs/{clubId}/beacon` 연동.
 * Figma(356:2171): bg-surface, rounded-20, pl-34 pr-50 py-40, gap-30.
 * 좌측 UUID(읽기 전용)·RSSI 임계값 슬라이더 / 우측 패널(지각 기준·안정화 시간) + 저장.
 */
export function BeaconSettingsCard() {
  const { activeClubId } = useActiveClub();
  const [uuid, setUuid] = useState("");
  const [lateThreshold, setLateThreshold] = useState("");
  const [rssiStabilization, setRssiStabilization] = useState("");
  const [rssiThreshold, setRssiThreshold] = useState(RSSI_MIN);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // 활성 동아리의 비콘 설정을 조회해 폼에 채운다.
  useEffect(() => {
    if (activeClubId === null) return;
    let active = true;
    setLoading(true);
    setError(null);
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
          setError(
            err instanceof ApiError
              ? err.message
              : "비콘 설정을 불러오지 못했습니다.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeClubId]);

  async function handleSave() {
    if (activeClubId === null) return;
    setError(null);
    setSaved(false);
    const body: BeaconConfigDto = {
      uuid: uuid.trim(),
      lateThresholdMinutes: Number(lateThreshold),
      rssiStabilizationSeconds: Number(rssiStabilization),
      rssiThreshold,
    };
    if (
      !body.uuid ||
      !Number.isInteger(body.lateThresholdMinutes) ||
      body.lateThresholdMinutes < 0 ||
      !Number.isInteger(body.rssiStabilizationSeconds) ||
      body.rssiStabilizationSeconds < 1
    ) {
      setError("모든 값을 올바르게 입력해주세요.");
      return;
    }
    setSaving(true);
    try {
      await beaconApi.updateBeaconConfig(activeClubId, body);
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "비콘 설정 저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center gap-[30px] rounded-[20px] bg-surface py-[40px] pl-[34px] pr-[50px]">
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold tracking-[0.25px] text-foreground-muted">
          비콘 설정
        </h2>
        {loading && (
          <span className="text-[15px] font-medium text-foreground-subtle">
            불러오는 중...
          </span>
        )}
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
            readOnly
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
                  onChange={(e) => setRssiThreshold(Number(e.target.value))}
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
            onChange={(e) => setLateThreshold(e.target.value)}
          />
          <SettingsField
            label="RSSI 신호 안정화 시간"
            placeholder="초"
            align="right"
            className="w-full"
            padding="px-[30px] py-[12px]"
            inputMode="numeric"
            value={rssiStabilization}
            onChange={(e) => setRssiStabilization(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-[16px]">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="rounded-[16px] bg-primary-hover px-[32px] py-[12px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "저장 중..." : "저장하기"}
        </button>
        {saved && (
          <span className="text-[15px] font-medium text-success">
            저장되었습니다.
          </span>
        )}
        {error && (
          <span className="text-[15px] font-medium text-destructive">
            {error}
          </span>
        )}
      </div>
    </div>
  );
}

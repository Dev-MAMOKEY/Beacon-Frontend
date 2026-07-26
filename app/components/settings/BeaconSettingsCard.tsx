import { useEffect, useState } from "react";
import { SettingsField } from "./SettingsField";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, beaconApi, type BeaconConfigDto } from "~/lib/api";

type Props = {
  /** RSSI 표시값 (예: "-70dBm"). 실시간 RSSI는 백엔드 미제공이라 표시용. */
  rssi?: string;
  /** 신호 세기 게이지 채움 비율 (0~100). */
  signalPercent?: number;
};

/**
 * 비콘 설정 카드. GET/PUT `/clubs/{clubId}/beacon` 연동.
 * Figma(188:819): bg-surface, rounded-20, pl-34 pr-50 py-40, gap-30.
 * 좌측 UUID·RSSI 게이지(표시용) / 우측 회색 패널(지각 기준·안정화 시간·RSSI 임계값) + 저장.
 */
export function BeaconSettingsCard({
  rssi = "-70dBm",
  signalPercent = 94,
}: Props) {
  const { activeClubId } = useActiveClub();
  const [uuid, setUuid] = useState("");
  const [lateThreshold, setLateThreshold] = useState("");
  const [rssiStabilization, setRssiStabilization] = useState("");
  const [rssiThreshold, setRssiThreshold] = useState("");
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
        setRssiThreshold(String(c.rssiThreshold ?? ""));
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
      rssiThreshold: Number(rssiThreshold),
    };
    if (
      !body.uuid ||
      Number.isNaN(body.lateThresholdMinutes) ||
      Number.isNaN(body.rssiStabilizationSeconds) ||
      Number.isNaN(body.rssiThreshold)
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
    <div className="flex flex-1 flex-col gap-[30px] rounded-[20px] bg-surface py-[40px] pl-[34px] pr-[50px]">
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
            value={uuid}
            readOnly
          />

          <div className="flex flex-col gap-[14px]">
            <span className="text-[18px] font-semibold text-foreground-subtle">
              RSSI
            </span>
            <span className="text-[28px] font-semibold text-primary-hover">
              {rssi}
            </span>
            <div className="flex flex-col">
              <div className="flex h-[44px] items-center">
                <div className="h-[16px] w-[414px] overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-primary-hover"
                    style={{ width: `${signalPercent}%` }}
                  />
                </div>
              </div>
              <div className="flex w-[414px] justify-between text-[16px] font-medium text-foreground-subtle">
                <span>(먼)</span>
                <span>(가까운)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[30px] rounded-[22px] bg-background p-[40px]">
          <SettingsField
            label="지각 시간 기준"
            placeholder="분"
            align="right"
            className="w-full"
            inputMode="numeric"
            value={lateThreshold}
            onChange={(e) => setLateThreshold(e.target.value)}
          />
          <SettingsField
            label="RSSI 신호 안정화 시간"
            placeholder="초"
            align="right"
            className="w-full"
            inputMode="numeric"
            value={rssiStabilization}
            onChange={(e) => setRssiStabilization(e.target.value)}
          />
          <SettingsField
            label="RSSI 임계값"
            placeholder="dBm (예: -70)"
            align="right"
            className="w-full"
            inputMode="numeric"
            value={rssiThreshold}
            onChange={(e) => setRssiThreshold(e.target.value)}
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

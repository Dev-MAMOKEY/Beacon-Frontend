import { useEffect, useState } from "react";
import { SettingsField } from "./SettingsField";
import { useActiveClub } from "~/hooks/use-active-club";
import { getClubUuid } from "~/lib/club/active-club";

type Props = {
  /** RSSI 표시값 (예: "-70dBm"). */
  rssi?: string;
  /** 신호 세기 게이지 채움 비율 (0~100). */
  signalPercent?: number;
};

/**
 * 비콘 설정 카드.
 * 대응 API가 없어 입력값은 로컬 상태로만 관리한다(서버 연동 제외).
 * Figma(188:819): bg-surface, rounded-20, pl-34 pr-50 py-40, gap-30.
 * 좌측 UUID·RSSI 게이지 / 우측 회색 패널(지각 시간 기준·RSSI 안정화 시간).
 */
export function BeaconSettingsCard({
  rssi = "-70dBm",
  signalPercent = 94,
}: Props) {
  const { activeClubId } = useActiveClub();
  const [uuid, setUuid] = useState("");
  const [lateThreshold, setLateThreshold] = useState("");
  const [rssiStabilization, setRssiStabilization] = useState("");

  // 생성 시 저장된 동아리 고정 UUID가 있으면 읽기 전용으로 표시.
  const storedUuid = activeClubId !== null ? getClubUuid(activeClubId) : null;
  useEffect(() => {
    if (storedUuid) setUuid(storedUuid);
  }, [storedUuid]);

  return (
    <div className="flex flex-1 flex-col gap-[30px] rounded-[20px] bg-surface py-[40px] pl-[34px] pr-[50px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">비콘 설정</h2>

      <div className="flex gap-[70px]">
        <div className="flex flex-col gap-[50px]">
          <SettingsField
            label="UUID"
            placeholder="e.g. FDA50693-A4E2-4FB1A4E2-4FB1"
            className="w-full"
            value={uuid}
            onChange={(e) => setUuid(e.target.value)}
            readOnly={storedUuid !== null}
          />

          <div className="flex flex-col gap-[14px]">
            <span className="text-[18px] font-semibold text-foreground-subtle">
              RSSI
            </span>
            <span className="text-[30px] font-semibold text-primary-hover">
              {rssi}
            </span>
            <div className="flex flex-col">
              <div className="flex h-[44px] items-center">
                <div className="h-[16px] w-[414px] overflow-hidden rounded-full bg-border-subtle">
                  <div
                    className="h-full rounded-full bg-primary-hover/50"
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

        <div className="flex flex-col gap-[50px] rounded-[22px] bg-surface-sunken p-[40px]">
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
        </div>
      </div>
    </div>
  );
}

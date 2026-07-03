import { SettingsField } from "./SettingsField";

type Props = {
  /** RSSI 표시값 (예: "-70dBm"). */
  rssi?: string;
  /** 신호 세기 게이지 채움 비율 (0~100). */
  signalPercent?: number;
};

/**
 * 비콘 설정 카드.
 * Figma(188:819): bg-surface, rounded-20, pl-34 pr-50 py-40, gap-30.
 * 좌측 UUID·RSSI 게이지 / 우측 회색 패널(지각 시간 기준·RSSI 안정화 시간).
 */
export function BeaconSettingsCard({
  rssi = "-70dBm",
  signalPercent = 94,
}: Props) {
  return (
    <div className="flex flex-1 flex-col gap-[30px] rounded-[20px] bg-surface py-[40px] pl-[34px] pr-[50px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">비콘 설정</h2>

      <div className="flex gap-[70px]">
        <div className="flex flex-col gap-[50px]">
          <SettingsField
            label="UUID"
            placeholder="e.g. FDA50693-A4E2-4FB1A4E2-4FB1"
            className="w-full"
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
          />
          <SettingsField
            label="RSSI 신호 안정화 시간"
            placeholder="초"
            align="right"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

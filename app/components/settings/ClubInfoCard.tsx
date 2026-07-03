import { useEffect, useState } from "react";
import { SettingsField } from "./SettingsField";
import { useActiveClub } from "~/hooks/use-active-club";
import { ApiError, clubsApi } from "~/lib/api";

/**
 * 동아리 정보 설정 카드.
 * 활성 동아리의 이름/설명을 조회(getClub)해 표시하고 수정(updateClub)한다.
 * Figma(188:751): bg-surface, rounded-20, px-50 py-40, gap-30.
 */
export function ClubInfoCard() {
  const { activeClubId } = useActiveClub();
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 활성 동아리 변경 시 정보 조회.
  useEffect(() => {
    if (activeClubId === null) return;
    let active = true;
    setLoading(true);
    setError(null);
    clubsApi
      .getClub(activeClubId)
      .then((club) => {
        if (!active) return;
        setClubName(club.clubName ?? "");
        setClubDescription(club.clubDescription ?? "");
      })
      .catch((err) => {
        if (active)
          setError(
            err instanceof ApiError
              ? err.message
              : "동아리 정보를 불러오지 못했습니다.",
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
    setSaving(true);
    setSaved(false);
    setError(null);
    try {
      await clubsApi.updateClub(activeClubId, { clubName, clubDescription });
      setSaved(true);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "저장에 실패했습니다.",
      );
    } finally {
      setSaving(false);
    }
  }

  const disabled = activeClubId === null || loading || saving;

  return (
    <div className="flex shrink-0 flex-col gap-[30px] rounded-[20px] bg-surface px-[50px] py-[40px]">
      <h2 className="text-[22px] font-bold text-foreground-subtle">동아리 정보</h2>
      <SettingsField
        label="동아리명"
        placeholder="동아리명을 입력해주세요"
        className="w-[530px]"
        value={clubName}
        onChange={(e) => {
          setClubName(e.target.value);
          setSaved(false);
        }}
        disabled={disabled}
      />
      <SettingsField
        label="설명"
        placeholder="동아리에 대한 설명을 입력해주세요"
        className="w-[530px]"
        value={clubDescription}
        onChange={(e) => {
          setClubDescription(e.target.value);
          setSaved(false);
        }}
        disabled={disabled}
      />

      {error && (
        <p className="text-[14px] font-medium text-destructive">{error}</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={disabled}
        className="self-end rounded-[12px] bg-primary-hover px-[24px] py-[10px] text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {saving ? "저장 중..." : saved ? "저장됨" : "저장"}
      </button>
    </div>
  );
}

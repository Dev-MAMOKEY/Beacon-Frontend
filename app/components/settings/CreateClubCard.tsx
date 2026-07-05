import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { SettingsField } from "./SettingsField";
import { clearMyProfileCache } from "~/hooks/use-my-profile";
import { ApiError, clubsApi } from "~/lib/api";
import { setStoredActiveClubId, storeClubUuid } from "~/lib/club/active-club";

/**
 * 동아리 생성 카드(설정 내).
 * createClub 후 활성 동아리 지정·fixedUuid 영속·프로필 캐시 무효화 후
 * 대시보드로 이동(재마운트로 clubIds 갱신).
 */
export function CreateClubCard() {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [clubDescription, setClubDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!clubName.trim()) {
      setError("동아리명을 입력해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await clubsApi.createClub({
        clubName: clubName.trim(),
        clubDescription: clubDescription.trim(),
      });
      if (res.clubId != null) {
        setStoredActiveClubId(res.clubId);
        if (res.fixedUuid) storeClubUuid(res.clubId, res.fixedUuid);
      }
      clearMyProfileCache();
      navigate("/");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "동아리 생성에 실패했습니다.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-[30px] rounded-[20px] bg-surface px-[50px] py-[40px]"
    >
      <h2 className="text-[22px] font-bold text-foreground-subtle">
        동아리 만들기
      </h2>
      <SettingsField
        label="동아리명"
        placeholder="동아리명을 입력해주세요"
        className="w-[530px]"
        value={clubName}
        onChange={(e) => setClubName(e.target.value)}
        disabled={submitting}
      />
      <SettingsField
        label="설명"
        placeholder="동아리에 대한 설명을 입력해주세요"
        className="w-[530px]"
        value={clubDescription}
        onChange={(e) => setClubDescription(e.target.value)}
        disabled={submitting}
      />

      {error && (
        <p className="text-[14px] font-medium text-destructive">{error}</p>
      )}

      <button
        type="submit"
        disabled={submitting || clubName.trim() === ""}
        className="self-end rounded-[12px] bg-primary px-[24px] py-[10px] text-[16px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-50"
      >
        {submitting ? "생성 중..." : "동아리 생성"}
      </button>
    </form>
  );
}

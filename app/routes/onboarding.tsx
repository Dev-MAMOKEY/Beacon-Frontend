import { type FormEvent, useState } from "react";
import { redirect, useNavigate } from "react-router";
import type { Route } from "./+types/onboarding";
import { AuthCard } from "~/components/auth/AuthCard";
import { TextField } from "~/components/ui/TextField";
import { clearMyProfileCache, loadMyProfile } from "~/hooks/use-my-profile";
import { ApiError, clubsApi } from "~/lib/api";
import { setStoredActiveClubId, storeClubUuid } from "~/lib/club/active-club";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "동아리 만들기 · Mamoki Campus" },
    { name: "description", content: "동아리 생성" },
  ];
}

/** 이미 동아리가 있으면 온보딩 접근 시 대시보드로 되돌린다. */
export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
  async (_args, next) => {
    try {
      const profile = await loadMyProfile();
      if (profile.clubIds && profile.clubIds.length > 0) {
        throw redirect("/");
      }
    } catch (err) {
      if (err instanceof Response) throw err;
    }
    return next();
  },
];

export default function Onboarding() {
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
      // 프로필 캐시 무효화 → 다음 조회 시 clubIds 갱신.
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-[30px] py-[60px]">
      <AuthCard title="동아리 만들기">
        <form className="flex flex-col gap-[34px]" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-[18px]">
            <TextField
              id="clubName"
              name="clubName"
              label="동아리명"
              placeholder="동아리명을 입력해주세요"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              disabled={submitting}
            />
            <TextField
              id="clubDescription"
              name="clubDescription"
              label="설명"
              placeholder="동아리에 대한 설명을 입력해주세요"
              value={clubDescription}
              onChange={(e) => setClubDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          {error && (
            <p className="text-[14px] font-medium text-destructive">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || clubName.trim() === ""}
            className="w-full rounded-[16px] bg-primary px-[80px] py-[18px] text-[18px] font-medium text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? "생성 중..." : "동아리 생성"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}

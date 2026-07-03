import { useEffect, useState } from "react";
import { useMyProfile } from "./use-my-profile";
import { clubsApi } from "~/lib/api";

export type ClubSummary = { clubId: number; clubName: string };

// clubId→이름 모듈 캐시. clubIds는 ID만 담아 이름을 개별 조회해야 하므로
// 중복 getClub 호출을 방지한다.
const nameCache = new Map<number, string>();

/**
 * 내가 속한 동아리 목록을 { clubId, clubName }으로 제공한다.
 * profile.clubIds의 각 id를 getClub으로 조회(캐시)해 이름을 채운다.
 */
export function useClubs(): { clubs: ClubSummary[]; loading: boolean } {
  const { profile, loading: profileLoading } = useMyProfile();
  const clubIds = profile?.clubIds ?? [];
  const clubKey = clubIds.join(",");
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (clubIds.length === 0) {
      setClubs([]);
      return;
    }
    let active = true;
    setLoading(true);
    Promise.all(
      clubIds.map(async (id): Promise<ClubSummary> => {
        const cached = nameCache.get(id);
        if (cached !== undefined) return { clubId: id, clubName: cached };
        try {
          const club = await clubsApi.getClub(id);
          const name = club.clubName ?? `동아리 ${id}`;
          nameCache.set(id, name);
          return { clubId: id, clubName: name };
        } catch {
          return { clubId: id, clubName: `동아리 ${id}` };
        }
      }),
    ).then((res) => {
      if (!active) return;
      setClubs(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
    // clubKey로 목록 변화만 추적.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubKey]);

  return { clubs, loading: loading || profileLoading };
}

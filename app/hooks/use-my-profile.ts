import { useEffect, useState } from "react";
import { type MemberProfileResponse, membersApi } from "~/lib/api";

type State = {
  profile: MemberProfileResponse | null;
  loading: boolean;
  error: string | null;
};

/**
 * 로그인 사용자의 프로필(GET /members/me)을 조회한다.
 * 클라이언트에서만 실행(토큰이 localStorage 기반)되며, 마운트 시 1회 호출한다.
 */
export function useMyProfile(): State {
  const [state, setState] = useState<State>({
    profile: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    membersApi
      .getMyProfile()
      .then((profile) => {
        if (active) setState({ profile, loading: false, error: null });
      })
      .catch((err) => {
        if (active)
          setState({
            profile: null,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : "프로필을 불러오지 못했습니다.",
          });
      });
    return () => {
      active = false;
    };
  }, []);

  return state;
}

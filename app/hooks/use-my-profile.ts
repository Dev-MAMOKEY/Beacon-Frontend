import { useEffect, useState } from "react";
import {
  getAccessToken,
  type MemberProfileResponse,
  membersApi,
} from "~/lib/api";

type State = {
  profile: MemberProfileResponse | null;
  loading: boolean;
  error: string | null;
};

// 모듈 레벨 캐시: 페이지 이동(헤더 재마운트)마다 재요청하지 않도록 1회만 조회한다.
// 토큰이 바뀌면(로그인/로그아웃) 캐시가 무효화되어 다시 조회한다.
let cache: { token: string | null; profile: MemberProfileResponse } | null =
  null;
let inflight: Promise<MemberProfileResponse> | null = null;

function hasFreshCache(): boolean {
  return cache !== null && cache.token === getAccessToken();
}

/**
 * 프로필을 조회한다(모듈 캐시 사용). 미들웨어 등 훅 밖에서도 재사용 가능.
 */
export function loadMyProfile(): Promise<MemberProfileResponse> {
  if (hasFreshCache()) return Promise.resolve(cache!.profile);
  if (!inflight) {
    inflight = membersApi
      .getMyProfile()
      .then((profile) => {
        cache = { token: getAccessToken(), profile };
        return profile;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

/** 프로필 캐시를 비운다(로그아웃 등에서 호출). */
export function clearMyProfileCache(): void {
  cache = null;
  inflight = null;
}

/**
 * 로그인 사용자의 프로필(GET /members/me)을 조회한다.
 * 모듈 캐시를 사용해 페이지 이동 시 재요청하지 않는다.
 */
export function useMyProfile(): State {
  const [state, setState] = useState<State>(() =>
    hasFreshCache()
      ? { profile: cache!.profile, loading: false, error: null }
      : { profile: null, loading: true, error: null },
  );

  useEffect(() => {
    if (hasFreshCache()) {
      setState({ profile: cache!.profile, loading: false, error: null });
      return;
    }
    let active = true;
    loadMyProfile()
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

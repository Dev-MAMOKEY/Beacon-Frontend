/**
 * 활성 동아리(active club) 선택 유틸리티.
 * members/me의 clubIds(멀티 클럽) 중 현재 조작 대상 clubId를 클라이언트에서 관리한다.
 * 저장은 localStorage(브라우저)에서만 유효하다.
 */
const ACTIVE_CLUB_KEY = "beacon.activeClubId";

const isBrowser = typeof window !== "undefined";

// 활성 clubId 변경을 구독하는 리스너들(전역 전파용).
const listeners = new Set<() => void>();

/** 활성 clubId 변경 구독. useSyncExternalStore에서 사용. */
export function subscribeActiveClub(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

/** localStorage에 저장된 활성 clubId. 없거나 숫자가 아니면 null. */
export function getStoredActiveClubId(): number | null {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(ACTIVE_CLUB_KEY);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isInteger(n) ? n : null;
}

/** 활성 clubId를 localStorage에 저장하고 구독자에게 알린다. */
export function setStoredActiveClubId(clubId: number): void {
  if (!isBrowser) return;
  window.localStorage.setItem(ACTIVE_CLUB_KEY, String(clubId));
  listeners.forEach((l) => l());
}

/**
 * clubIds 목록에서 활성 clubId를 결정한다.
 * - 저장값이 목록에 있으면 그것을 사용
 * - 없거나 무효면 첫 번째 항목으로 폴백
 * - 목록이 비어 있으면 null
 */
export function resolveActiveClubId(
  clubIds: number[] | undefined,
): number | null {
  if (!clubIds || clubIds.length === 0) return null;
  const stored = getStoredActiveClubId();
  if (stored !== null && clubIds.includes(stored)) return stored;
  return clubIds[0];
}

// 동아리별 고정 UUID. createClub 응답에만 있고 getClub은 반환하지 않아,
// 생성 시점에 저장해 비콘 설정에서 재사용한다.
const CLUB_UUID_PREFIX = "beacon.clubUuid.";

/** 동아리 고정 UUID를 저장(생성 시). */
export function storeClubUuid(clubId: number, uuid: string): void {
  if (!isBrowser) return;
  window.localStorage.setItem(`${CLUB_UUID_PREFIX}${clubId}`, uuid);
}

/** 저장된 동아리 고정 UUID. 없으면 null. */
export function getClubUuid(clubId: number): string | null {
  if (!isBrowser) return null;
  return window.localStorage.getItem(`${CLUB_UUID_PREFIX}${clubId}`);
}

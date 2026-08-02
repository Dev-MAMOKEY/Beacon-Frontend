import { createContext, useContext, useEffect, useRef } from "react";

/** 카드가 노출하는 저장 동작. 실패는 throw로 알린다. */
export type SaveFn = () => Promise<void>;

type SettingsSave = {
  /** 저장 함수를 등록하고, 해제 함수를 돌려준다. */
  register: (fn: SaveFn) => () => void;
};

export const SettingsSaveContext = createContext<SettingsSave | null>(null);

/**
 * 설정 카드가 자신의 저장 동작을 상단 "저장하기" 버튼에 등록한다.
 * 시안(485:915)에서 저장 버튼이 페이지 상단으로 올라가, 카드별 저장 버튼이 사라졌다.
 *
 * 최신 fn을 ref로 들고 있어 등록/해제는 마운트 시 한 번만 일어난다.
 */
export function useRegisterSave(fn: SaveFn): void {
  const ctx = useContext(SettingsSaveContext);
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!ctx) return;
    return ctx.register(() => fnRef.current());
  }, [ctx]);
}

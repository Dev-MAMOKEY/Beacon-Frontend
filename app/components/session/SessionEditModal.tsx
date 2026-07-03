import { X } from "lucide-react";
import type { ReactNode } from "react";
import { ActivityBadge } from "./ActivityBadge";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TIME_FIELDS = ["오후", "시", "분"];
const REPEAT_DAYS = [
  "월요일",
  "화요일",
  "수요일",
  "목요일",
  "금요일",
  "토요일",
  "일요일",
];

/** 흰 카드 섹션. 모달 내부 그룹 공통 스타일. */
function Section({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-[12px] rounded-[20px] bg-surface px-[26px] pb-[24px] pt-[20px] ${className}`}
    >
      <p className="text-[18px] font-semibold text-foreground-subtle">{title}</p>
      {children}
    </div>
  );
}

/** 입력/선택 박스(플레이스홀더). API 연동 전까지 표시 전용. */
function Box({ placeholder, className = "" }: { placeholder: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[10px] border-2 border-border-subtle px-[14px] py-[10px] ${className}`}
    >
      <span className="text-[16px] font-semibold text-input">{placeholder}</span>
    </div>
  );
}

/** 시작/종료 시각 선택 행 (오후·시·분). */
function TimeRow({ label }: { label: string }) {
  return (
    <div className="flex w-full flex-col gap-[10px]">
      <p className="text-[14px] font-medium text-foreground-subtle">{label}</p>
      <div className="flex w-full gap-[12px]">
        {TIME_FIELDS.map((f) => (
          <Box key={f} placeholder={f} className="flex-1" />
        ))}
      </div>
    </div>
  );
}

/**
 * 세션 수정 모달.
 * Figma(182:586): 제목/내용 · 날짜 · 시간 · 반복(요일) · 활동 선택 · 완료하기.
 * open=false면 렌더하지 않는다. 배경 클릭·X로 닫힘.
 */
export function SessionEditModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-[40px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="flex w-[700px] max-w-full flex-col gap-[14px] rounded-[22px] bg-surface-sunken px-[40px] py-[30px]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="세션 수정"
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[26px] font-semibold text-foreground">세션 수정</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-full p-[8px] text-foreground-muted hover:bg-border-subtle"
          >
            <X className="size-[14px]" />
          </button>
        </div>

        <Section title="제목 및 내용">
          <Box placeholder="제목을 입력하세요" className="w-full justify-start" />
          <Box placeholder="내용을 입력하세요" className="w-full justify-start" />
        </Section>

        <div className="flex w-full gap-[20px]">
          <Section title="날짜" className="flex-1">
            <TimeRow label="시작" />
            <TimeRow label="종료" />
          </Section>
          <Section title="시간" className="flex-1">
            <TimeRow label="시작" />
            <TimeRow label="종료" />
          </Section>
        </div>

        <Section title="반복">
          <div className="flex flex-col gap-[10px]">
            <div className="flex w-full gap-[10px]">
              <Box placeholder="매주" className="flex-1" />
              <Box placeholder="매일" className="flex-1" />
            </div>
            <div className="flex w-full gap-[12px]">
              {REPEAT_DAYS.map((d) => (
                <Box key={d} placeholder={d} className="flex-1" />
              ))}
            </div>
          </div>
        </Section>

        <Section title="활동 선택">
          <div className="flex items-center gap-[24px]">
            <ActivityBadge category="동아리" />
            <ActivityBadge category="프로젝트" />
            <ActivityBadge category="회의" />
          </div>
        </Section>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-[16px] bg-border-subtle px-[26px] py-[14px] text-[18px] font-medium text-foreground-subtle transition-opacity hover:opacity-90"
        >
          완료하기
        </button>
      </div>
    </div>
  );
}

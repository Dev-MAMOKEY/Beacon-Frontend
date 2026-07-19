import { X } from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import {
  ApiError,
  type Session,
  type SessionCreateRequestDto,
  sessionsApi,
} from "~/lib/api";
import { isoToLocalInput, localInputToIso } from "~/lib/datetime";

type DayOfWeek = NonNullable<SessionCreateRequestDto["dayOfWeek"]>;

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "MONDAY", label: "월요일" },
  { value: "TUESDAY", label: "화요일" },
  { value: "WEDNESDAY", label: "수요일" },
  { value: "THURSDAY", label: "목요일" },
  { value: "FRIDAY", label: "금요일" },
  { value: "SATURDAY", label: "토요일" },
  { value: "SUNDAY", label: "일요일" },
];

/** 활동 카테고리(시안 전용, 백엔드 필드 없음 → 화면·로컬 상태만). */
const CATEGORIES = [
  { value: "club", label: "동아리", cls: "bg-background text-primary-hover", sel: "border-primary-hover" },
  { value: "project", label: "프로젝트", cls: "bg-[#ffefe7] text-[#ff8243]", sel: "border-[#ff8243]" },
  { value: "meeting", label: "회의", cls: "bg-[#ede6ff] text-[#6d45db]", sel: "border-[#6d45db]" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  /** 활성 clubId. null이면 저장 불가. */
  clubId: number | null;
  /** 있으면 수정 모드. */
  session?: Session | null;
  /** 생성 시 반복 기본값(반복 세션 만들기 버튼). */
  repeatDefault?: boolean;
  /** 저장 성공 시(목록 갱신). */
  onSaved?: () => void;
};

type DateParts = { year: string; month: string; day: string };
type TimeParts = { ampm: string; hour: string; minute: string };
const EMPTY_DATE: DateParts = { year: "", month: "", day: "" };
const EMPTY_TIME: TimeParts = { ampm: "", hour: "", minute: "" };

const pad = (n: number) => String(n).padStart(2, "0");
const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i);

/** "YYYY-MM-DDTHH:mm"(datetime-local) → 날짜/시간 파트. */
function splitLocal(local: string): { date: DateParts; time: TimeParts } {
  if (!local) return { date: { ...EMPTY_DATE }, time: { ...EMPTY_TIME } };
  const [d, t] = local.split("T");
  const [y, mo, da] = d.split("-");
  const [h, mi] = t.split(":");
  const h24 = Number(h);
  return {
    date: { year: y, month: String(Number(mo)), day: String(Number(da)) },
    time: {
      ampm: h24 >= 12 ? "오후" : "오전",
      hour: String(h24 % 12 === 0 ? 12 : h24 % 12),
      minute: String(Number(mi)),
    },
  };
}

/** 날짜/시간 파트 → "YYYY-MM-DDTHH:mm". 하나라도 비면 "". */
function joinLocal(date: DateParts, time: TimeParts): string {
  if (
    !date.year || !date.month || !date.day ||
    !time.ampm || !time.hour || time.minute === ""
  )
    return "";
  let h = Number(time.hour) % 12;
  if (time.ampm === "오후") h += 12;
  return `${date.year}-${pad(Number(date.month))}-${pad(Number(date.day))}T${pad(h)}:${pad(Number(time.minute))}`;
}

/** 흰 카드 섹션. Figma(368:3332): rounded-20, pt-20 px-26 pb-24, 라벨 16px gray2. */
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
      <p className="text-[16px] font-semibold text-foreground-subtle">{title}</p>
      {children}
    </div>
  );
}

/** 채움형 텍스트 입력(gray4 배경, rounded-10). */
const inputCls =
  "rounded-[10px] bg-border-subtle px-[24px] py-[10px] text-[16px] text-foreground placeholder:text-input focus:outline-none focus:ring-2 focus:ring-primary";

/** 시안의 pill 형태 셀렉트(연하늘 배경 rounded-10). */
function PillSelect({
  value,
  onChange,
  placeholder,
  options,
  disabled,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { v: string; label: string }[];
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      aria-label={placeholder}
      className={`rounded-[10px] bg-background px-[14px] py-[10px] text-[14px] focus:outline-none focus:ring-2 focus:ring-primary ${value ? "text-foreground" : "text-input"} ${className}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.v} value={o.v} className="text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  );
}

const YEAR_OPTS = (() => {
  const y = new Date().getFullYear();
  return range(y - 1, y + 2).map((v) => ({ v: String(v), label: `${v}년` }));
})();
const MONTH_OPTS = range(1, 12).map((v) => ({ v: String(v), label: `${v}월` }));
const DAY_OPTS = range(1, 31).map((v) => ({ v: String(v), label: `${v}일` }));
const AMPM_OPTS = [
  { v: "오전", label: "오전" },
  { v: "오후", label: "오후" },
];
const HOUR_OPTS = range(1, 12).map((v) => ({ v: String(v), label: `${v}시` }));
const MIN_OPTS = range(0, 59).map((v) => ({ v: String(v), label: `${pad(v)}분` }));

/**
 * 세션 생성/수정 모달. Figma(368:3324)의 구조를 그대로 재구성.
 * 제목+내용 · 날짜/시간(오전·오후/시/분 pill) · 반복 · 활동 선택 · 완료하기.
 *
 * 저장(API) 대상: 이름·시작/종료 시각·주간 반복(dayOfWeek).
 * 시안 전용(백엔드 필드 없음 → 화면·로컬 상태만): 내용·활동 카테고리·매일 반복.
 */
export function SessionEditModal({
  open,
  onClose,
  clubId,
  session = null,
  repeatDefault = false,
  onSaved,
}: Props) {
  const isEdit = session != null;
  const [sessionName, setSessionName] = useState("");
  const [content, setContent] = useState(""); // 시안 전용(미저장)
  const [startDate, setStartDate] = useState<DateParts>({ ...EMPTY_DATE });
  const [startTime, setStartTime] = useState<TimeParts>({ ...EMPTY_TIME });
  const [endDate, setEndDate] = useState<DateParts>({ ...EMPTY_DATE });
  const [endTime, setEndTime] = useState<TimeParts>({ ...EMPTY_TIME });
  const [repeatMode, setRepeatMode] = useState<"" | "weekly" | "daily">("");
  const [weekdays, setWeekdays] = useState<DayOfWeek[]>([]);
  const [category, setCategory] = useState(""); // 시안 전용(미저장)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 열릴 때 초기화(수정=기존 값, 생성=빈 값 + 반복 기본).
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSessionName(session?.sessionName ?? "");
    setContent("");
    const s = splitLocal(isoToLocalInput(session?.expectStartAt));
    const e = splitLocal(isoToLocalInput(session?.expectEndAt));
    setStartDate(s.date);
    setStartTime(s.time);
    setEndDate(e.date);
    setEndTime(e.time);
    setRepeatMode(repeatDefault ? "weekly" : "");
    setWeekdays([]);
    setCategory("");
  }, [open, session, repeatDefault]);

  if (!open) return null;

  function toggleWeekday(d: DayOfWeek) {
    setWeekdays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!sessionName.trim()) return setError("제목을 입력해주세요.");
    const startIso = localInputToIso(joinLocal(startDate, startTime));
    const endIso = localInputToIso(joinLocal(endDate, endTime));
    if (!startIso || !endIso)
      return setError("시작·종료 날짜와 시간을 모두 선택해주세요.");
    if (new Date(startIso) >= new Date(endIso))
      return setError("종료는 시작 이후여야 합니다.");
    if (clubId === null) return setError("활성 동아리가 없습니다.");
    if (isEdit && session?.sessionId == null)
      return setError("세션 정보를 찾을 수 없습니다.");

    setSubmitting(true);
    try {
      if (isEdit && session?.sessionId != null) {
        await sessionsApi.updateSession(clubId, session.sessionId, {
          sessionName: sessionName.trim(),
          expectStartAt: startIso,
          expectEndAt: endIso,
        });
      } else {
        const body: SessionCreateRequestDto = {
          sessionName: sessionName.trim(),
          expectStartAt: startIso,
          expectEndAt: endIso,
        };
        // 주간 반복만 API 지원(요일은 선택 첫 번째). 매일 반복은 시안 전용.
        if (repeatMode === "weekly" && weekdays.length > 0) {
          body.isRepeat = true;
          body.dayOfWeek = weekdays[0];
        }
        await sessionsApi.createSession(clubId, body);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  const sub = "text-[14px] font-semibold uppercase tracking-[0.7px] text-[#727785]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-foreground/50 p-[40px]"
      onClick={onClose}
      role="presentation"
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-[700px] max-w-full flex-col gap-[14px] rounded-[22px] bg-surface-sunken px-[40px] py-[30px]"
        onClick={(e) => e.stopPropagation()}
        aria-label={isEdit ? "세션 수정" : "세션 생성"}
      >
        <div className="flex w-full items-center justify-between">
          <h2 className="text-[24px] font-semibold uppercase tracking-[0.5px] text-foreground-muted">
            {isEdit ? "세션 수정" : "세션 생성"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="rounded-full p-[8px] text-foreground-muted hover:bg-border-subtle"
          >
            <X className="size-[14px]" />
          </button>
        </div>

        {/* 제목 및 내용 */}
        <Section title="제목 및 내용">
          <input
            className={inputCls}
            placeholder="제목을 입력하세요"
            value={sessionName}
            onChange={(e) => setSessionName(e.target.value)}
            disabled={submitting}
          />
          <input
            className={inputCls}
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={submitting}
          />
        </Section>

        {/* 날짜 / 시간 */}
        <div className="flex w-full gap-[20px]">
          <Section title="날짜" className="flex-1">
            <div className="flex flex-col gap-[10px]">
              <p className={sub}>시작</p>
              <div className="flex gap-[12px]">
                <PillSelect className="flex-1" placeholder="년" options={YEAR_OPTS} value={startDate.year} onChange={(v) => setStartDate((p) => ({ ...p, year: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="월" options={MONTH_OPTS} value={startDate.month} onChange={(v) => setStartDate((p) => ({ ...p, month: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="일" options={DAY_OPTS} value={startDate.day} onChange={(v) => setStartDate((p) => ({ ...p, day: v }))} disabled={submitting} />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className={sub}>종료</p>
              <div className="flex gap-[12px]">
                <PillSelect className="flex-1" placeholder="년" options={YEAR_OPTS} value={endDate.year} onChange={(v) => setEndDate((p) => ({ ...p, year: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="월" options={MONTH_OPTS} value={endDate.month} onChange={(v) => setEndDate((p) => ({ ...p, month: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="일" options={DAY_OPTS} value={endDate.day} onChange={(v) => setEndDate((p) => ({ ...p, day: v }))} disabled={submitting} />
              </div>
            </div>
          </Section>

          <Section title="시간" className="flex-1">
            <div className="flex flex-col gap-[10px]">
              <p className={sub}>시작</p>
              <div className="flex gap-[12px]">
                <PillSelect className="flex-1" placeholder="오전/오후" options={AMPM_OPTS} value={startTime.ampm} onChange={(v) => setStartTime((p) => ({ ...p, ampm: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="시" options={HOUR_OPTS} value={startTime.hour} onChange={(v) => setStartTime((p) => ({ ...p, hour: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="분" options={MIN_OPTS} value={startTime.minute} onChange={(v) => setStartTime((p) => ({ ...p, minute: v }))} disabled={submitting} />
              </div>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className={sub}>종료</p>
              <div className="flex gap-[12px]">
                <PillSelect className="flex-1" placeholder="오전/오후" options={AMPM_OPTS} value={endTime.ampm} onChange={(v) => setEndTime((p) => ({ ...p, ampm: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="시" options={HOUR_OPTS} value={endTime.hour} onChange={(v) => setEndTime((p) => ({ ...p, hour: v }))} disabled={submitting} />
                <PillSelect className="flex-1" placeholder="분" options={MIN_OPTS} value={endTime.minute} onChange={(v) => setEndTime((p) => ({ ...p, minute: v }))} disabled={submitting} />
              </div>
            </div>
          </Section>
        </div>

        {/* 반복 */}
        <Section title="반복">
          <div className="flex gap-[12px]">
            {(["weekly", "daily"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setRepeatMode((m) => (m === mode ? "" : mode))}
                disabled={submitting}
                className={`h-[37px] flex-1 rounded-[10px] px-[14px] text-[14px] font-medium transition-colors ${
                  repeatMode === mode
                    ? "bg-primary-hover text-white"
                    : "bg-background text-foreground-subtle"
                }`}
              >
                {mode === "weekly" ? "매주" : "매일"}
              </button>
            ))}
          </div>
          <div className="flex gap-[10px]">
            {DAYS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => toggleWeekday(d.value)}
                disabled={submitting || repeatMode !== "weekly"}
                className={`h-[37px] flex-1 rounded-[10px] px-[8px] text-[14px] font-medium transition-colors disabled:opacity-50 ${
                  weekdays.includes(d.value)
                    ? "bg-primary-hover text-white"
                    : "bg-background text-foreground-subtle"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </Section>

        {/* 활동 선택(시안 전용, 미저장) */}
        <Section title="활동 선택">
          <div className="flex gap-[24px]">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => setCategory((v) => (v === c.value ? "" : c.value))}
                disabled={submitting}
                className={`rounded-[16px] border-2 px-[12px] py-[8px] text-[16px] font-semibold transition-colors ${c.cls} ${
                  category === c.value ? c.sel : "border-transparent"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Section>

        {error && (
          <p className="text-[14px] font-medium text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[20px] bg-primary-hover px-[26px] py-[16px] text-[18px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "저장 중..." : "완료하기"}
        </button>
      </form>
    </div>
  );
}

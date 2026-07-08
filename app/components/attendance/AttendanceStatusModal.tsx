import { X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { ApiError, type AttendanceDto, attendanceApi } from "~/lib/api";
import {
  ATTENDANCE_STATUSES,
  type AttendanceStatusCode,
  STATUS_LABEL,
} from "~/lib/attendance";

type Props = {
  open: boolean;
  onClose: () => void;
  record: AttendanceDto | null;
  clubId: number | null;
  sessionId: number | null;
  onSaved?: () => void;
};

/**
 * 출석 상태 변경 모달(§17-14).
 * 상태 라디오(출석/지각/결석/기타) + 기타 선택 시 사유 메모 → PATCH 상태 변경.
 */
export function AttendanceStatusModal({
  open,
  onClose,
  record,
  clubId,
  sessionId,
  onSaved,
}: Props) {
  const [status, setStatus] = useState<AttendanceStatusCode>("PRESENT");
  const [adminNote, setAdminNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setStatus(record?.attendanceStatus ?? "PRESENT");
    setAdminNote(record?.adminNote ?? "");
    setError(null);
  }, [open, record]);

  if (!open || !record) return null;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (clubId === null || sessionId === null || record?.recordId == null) {
      setError("대상 정보를 찾을 수 없습니다.");
      return;
    }

    setSubmitting(true);
    try {
      await attendanceApi.updateAttendanceStatus(
        clubId,
        sessionId,
        record.recordId,
        {
          attendanceStatus: status,
          adminNote: status === "ETC" ? adminNote.trim() || undefined : undefined,
        },
      );
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "변경에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-[40px]"
      onClick={onClose}
      role="presentation"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="flex w-[420px] max-w-full flex-col gap-[20px] rounded-[22px] bg-surface px-[36px] py-[30px]"
        aria-label="출석 상태 변경"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-semibold text-foreground">
            출석 상태 변경
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

        <p className="text-[16px] font-medium text-foreground-subtle">
          {record.memberName} · {record.stdId}
        </p>

        <div className="flex flex-col gap-[10px]">
          {ATTENDANCE_STATUSES.map((s) => (
            <label
              key={s}
              className="flex items-center gap-[10px] text-[16px] font-medium text-foreground"
            >
              <input
                type="radio"
                name="status"
                checked={status === s}
                onChange={() => setStatus(s)}
                disabled={submitting}
              />
              {STATUS_LABEL[s]}
            </label>
          ))}
        </div>

        {status === "ETC" && (
          <input
            className="rounded-[10px] border-2 border-input bg-transparent px-[16px] py-[10px] text-[16px] text-foreground focus:border-primary focus:outline-none"
            placeholder="사유 메모 (예: 병결, 공결)"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            disabled={submitting}
          />
        )}

        {error && (
          <p className="text-[14px] font-medium text-destructive">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-[14px] bg-primary px-[24px] py-[12px] text-[16px] font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60"
        >
          {submitting ? "변경 중..." : "확인"}
        </button>
      </form>
    </div>
  );
}

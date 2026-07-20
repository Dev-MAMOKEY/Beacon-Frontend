import type { ExportItem } from "~/lib/api";

/** 출석 상태 코드 → 한글. */
const STATUS_KR: Record<NonNullable<ExportItem["status"]>, string> = {
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
  ETC: "기타",
};

const HEADERS = ["이름", "학번", "세션", "날짜", "상태", "비고"];

/** ExportItem[] → 문자열 행 배열(헤더 포함). */
function toRows(items: ExportItem[]): string[][] {
  return [
    HEADERS,
    ...items.map((it) => [
      it.memberName ?? "",
      it.stdId ?? "",
      it.sessionName ?? "",
      it.date ?? "",
      it.status ? STATUS_KR[it.status] : "",
      it.adminNote ?? "",
    ]),
  ];
}

/** Blob을 파일로 다운로드한다. */
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** CSV 셀 이스케이프(콤마·따옴표·개행 대응). */
function csvCell(v: string): string {
  return /[",\r\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

const escapeHtml = (v: string) =>
  v.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c,
  );

/** CSV 다운로드. 엑셀 한글 깨짐 방지를 위해 UTF-8 BOM을 붙인다. */
export function exportCsv(filename: string, items: ExportItem[]) {
  const csv = toRows(items)
    .map((r) => r.map(csvCell).join(","))
    .join("\r\n");
  download(
    new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }),
    filename,
  );
}

/**
 * Excel(.xls) 다운로드. 별도 라이브러리 없이 HTML 테이블 기반으로 생성하며
 * Excel이 워크시트로 연다.
 */
export function exportXls(filename: string, items: ExportItem[]) {
  const body = toRows(items)
    .map((r) => `<tr>${r.map((c) => `<td>${escapeHtml(c)}</td>`).join("")}</tr>`)
    .join("");
  const html =
    `<html xmlns:x="urn:schemas-microsoft-com:office:excel"><head>` +
    `<meta charset="utf-8"></head><body><table>${body}</table></body></html>`;
  download(
    new Blob(["﻿" + html], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    }),
    filename,
  );
}

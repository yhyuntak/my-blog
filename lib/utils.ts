import { format } from "date-fns";

export function formatDate(date: string): string {
  // UTC 기준으로 포맷팅 (서버/클라이언트 타임존 차이로 인한 hydration 에러 방지)
  const d = new Date(date);
  const utcDate = new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
  return format(utcDate, "MMMM dd, yyyy");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

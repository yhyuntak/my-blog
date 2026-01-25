import { format } from "date-fns";

export function formatDate(date: string): string {
  return format(new Date(date), "MMMM dd, yyyy");
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

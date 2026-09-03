import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { id } from "date-fns/locale";

/**
 * Utility for combining Tailwind CSS class names
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format bigint or number into Indonesian Rupiah format (locale id-ID)
 * Example: 1234000 -> "Rp 1.234.000"
 */
export function formatRupiah(amount: number | bigint): string {
  const numAmount = typeof amount === "bigint" ? Number(amount) : amount;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  })
    .format(numAmount)
    .replace("IDR", "Rp")
    .trim();
}

/**
 * Format relative date time in Indonesian (e.g. "3 hari lalu", "kemarin")
 */
export function formatRelativeDate(dateInput: Date | string): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: id,
  });
}

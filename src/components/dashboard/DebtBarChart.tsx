import { formatRupiah } from "@/lib/utils";

interface DebtBarChartProps {
  totalOwedToMe: string | bigint;
  totalIOwe: string | bigint;
}

export function DebtBarChart({
  totalOwedToMe,
  totalIOwe,
}: DebtBarChartProps) {
  const owedVal = typeof totalOwedToMe === "string" ? BigInt(totalOwedToMe) : totalOwedToMe;
  const oweVal = typeof totalIOwe === "string" ? BigInt(totalIOwe) : totalIOwe;

  const maxVal = owedVal > oweVal ? owedVal : oweVal;

  const owedPercent = maxVal > BigInt(0) ? Number((owedVal * BigInt(100)) / maxVal) : 0;
  const owePercent = maxVal > BigInt(0) ? Number((oweVal * BigInt(100)) / maxVal) : 0;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/90 dark:border-zinc-800 shadow-sm mb-6">
      <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-3">
        <span>Rasio Piutang vs Utang</span>
        <span className="text-zinc-500 font-normal">
          Piutang: {formatRupiah(owedVal)} | Utang: {formatRupiah(oweVal)}
        </span>
      </div>

      <div className="h-2.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
        <div
          className="h-full bg-[#D94E15] transition-all duration-500"
          style={{ width: `${Math.max(owedPercent, 1)}%` }}
        />
        <div
          className="h-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-500"
          style={{ width: `${Math.max(owePercent, 1)}%` }}
        />
      </div>
    </div>
  );
}

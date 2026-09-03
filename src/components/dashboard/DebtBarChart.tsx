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
    <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm mb-6">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
          Perbandingan Rasio Utang vs Piutang
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Visualisasi rasio total piutang yang akan kamu terima vs total kewajiban utang kamu
        </p>
      </div>

      <div className="space-y-4">
        {/* Bar 1: Dihutang ke saya */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-[#FC5810] flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FC5810]" />
              Total Dihutang ke Saya (Piutang)
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {formatRupiah(owedVal)}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#FC5810] transition-all duration-500"
              style={{ width: `${Math.max(owedPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Bar 2: Saya hutang */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-rose-500 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Total Saya Hutang (Utang)
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {formatRupiah(oweVal)}
            </span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
            <div
              className="h-full rounded-full bg-rose-500 transition-all duration-500"
              style={{ width: `${Math.max(owePercent, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

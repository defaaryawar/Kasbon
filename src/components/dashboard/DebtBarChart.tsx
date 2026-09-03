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
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
            Perbandingan Rasio Utang vs Piutang
          </h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Visualisasi perbandingan total dihutang ke kamu vs total kewajiban kamu
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Bar 1: Dihutang ke saya */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Total Dihutang ke Saya (Piutang)
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {formatRupiah(owedVal)}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
              style={{ width: `${Math.max(owedPercent, 2)}%` }}
            />
          </div>
        </div>

        {/* Bar 2: Saya hutang */}
        <div>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Total Saya Hutang (Utang)
            </span>
            <span className="text-zinc-900 dark:text-zinc-100 font-bold">
              {formatRupiah(oweVal)}
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-400 transition-all duration-500"
              style={{ width: `${Math.max(owePercent, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { formatRupiah } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Scale } from "lucide-react";

interface SummaryCardsProps {
  totalOwedToMe: string | bigint;
  totalIOwe: string | bigint;
  net: string | bigint;
}

export function SummaryCards({
  totalOwedToMe,
  totalIOwe,
  net,
}: SummaryCardsProps) {
  const owedVal = typeof totalOwedToMe === "string" ? BigInt(totalOwedToMe) : totalOwedToMe;
  const oweVal = typeof totalIOwe === "string" ? BigInt(totalIOwe) : totalIOwe;
  const netVal = typeof net === "string" ? BigInt(net) : net;

  const isNetPositive = netVal >= BigInt(0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total dihutang ke saya */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total dihutang ke saya
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {formatRupiah(owedVal)}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Uang kamu yang belum dibayar orang
        </p>
      </div>

      {/* Card 2: Total saya hutang */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Total saya hutang
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-rose-600 dark:text-rose-400">
          {formatRupiah(oweVal)}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Kewajiban bayar kamu ke orang lain
        </p>
      </div>

      {/* Card 3: Net */}
      <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Net
          </span>
          <div
            className={`p-2 rounded-xl ${
              isNetPositive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div
          className={`text-2xl sm:text-3xl font-extrabold ${
            isNetPositive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}
        >
          {formatRupiah(netVal)}
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {isNetPositive
            ? "Posisi keuangan kamu surplus 👍"
            : "Kamu harus siap-siap bayar utang ⚠️"}
        </p>
      </div>
    </div>
  );
}

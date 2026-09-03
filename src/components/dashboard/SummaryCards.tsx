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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {/* Card 1: Total dihutang ke saya */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Dihutang ke Saya
          </span>
          <div className="p-2 rounded-xl bg-[#D94E15]/10 text-[#D94E15]">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          {formatRupiah(owedVal)}
        </div>
      </div>

      {/* Card 2: Total saya hutang */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Saya Hutang
          </span>
          <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-zinc-900 dark:text-white">
          {formatRupiah(oweVal)}
        </div>
      </div>

      {/* Card 3: Saldo Net */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
            Saldo Net
          </span>
          <div className="p-2 rounded-xl bg-[#D94E15]/10 text-[#D94E15]">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-[#D94E15]">
          {formatRupiah(netVal)}
        </div>
      </div>
    </div>
  );
}

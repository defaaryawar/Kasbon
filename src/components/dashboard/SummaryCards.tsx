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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-4">
      {/* Card 1: Total Dihutang ke Saya */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-[#D94E15]">
            <ArrowUpRight className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#D94E15]/10 text-[#D94E15]">
            Piutang
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-0.5">
            Total Dihutang ke Saya
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            {formatRupiah(owedVal)}
          </p>
        </div>
      </div>

      {/* Card 2: Total Saya Hutang */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
            <ArrowDownLeft className="w-4.5 h-4.5" />
          </div>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-zinc-100 text-zinc-600">
            Utang
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-0.5">
            Total Saya Hutang
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-zinc-900 tracking-tight">
            {formatRupiah(oweVal)}
          </p>
        </div>
      </div>

      {/* Card 3: Saldo Net */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-[#D94E15]">
            <Scale className="w-4.5 h-4.5" />
          </div>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
              isNetPositive
                ? "bg-[#D94E15]/10 text-[#D94E15]"
                : "bg-zinc-100 text-zinc-600"
            }`}
          >
            {isNetPositive ? "+Surplus" : "-Defisit"}
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-zinc-500 mb-0.5">
            Saldo Net
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-[#D94E15] tracking-tight">
            {formatRupiah(netVal)}
          </p>
        </div>
      </div>
    </div>
  );
}

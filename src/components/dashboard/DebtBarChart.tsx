import { formatRupiah } from "@/lib/utils";
import { ArrowUpRight, ArrowDownLeft, Scale, BarChart2 } from "lucide-react";

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

  const totalVolume = owedVal + oweVal;

  let piutangPercent = 0;
  let utangPercent = 0;

  if (totalVolume > BigInt(0)) {
    piutangPercent = Math.round(Number((owedVal * BigInt(100)) / totalVolume));
    utangPercent = 100 - piutangPercent;
  } else {
    // When volume is 0, both percentages are 0%
    piutangPercent = 0;
    utangPercent = 0;
  }

  const radius = 60;
  const halfCircumference = Math.PI * radius; // ~188.5
  // If totalVolume is 0, offset is full circumference (0% arc)
  const strokeDashoffset = totalVolume > BigInt(0)
    ? halfCircumference - (halfCircumference * piutangPercent) / 100
    : halfCircumference;

  const netVal = owedVal - oweVal;
  const isNetPositive = netVal >= BigInt(0);

  return (
    <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#D94E15]/10 flex items-center justify-center text-[#D94E15]">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-900">
              Analisis Utang vs Piutang
            </h3>
            <p className="text-[11px] text-zinc-500 font-medium">
              Perbandingan rasio piutang yang dihutang ke kamu vs utang kamu
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#D94E15]/10 text-[#D94E15]">
          {isNetPositive ? "Net Positive" : "Net Defisit"}
        </span>
      </div>

      {/* Main Grid: Semi-Circle Gauge (Left) + Bar Chart Comparison (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-1">
        {/* Left: Semi-Circle Gauge Arc */}
        <div className="flex flex-col items-center justify-center relative border-b md:border-b-0 md:border-r border-zinc-100 pb-4 md:pb-0 md:pr-4">
          <div className="relative w-48 h-26 flex items-center justify-center">
            <svg viewBox="0 0 160 85" className="w-full h-full">
              <path
                d="M 20 75 A 60 60 0 0 1 140 75"
                fill="none"
                stroke="#f4f4f5"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 20 75 A 60 60 0 0 1 140 75"
                fill="none"
                stroke="#D94E15"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={halfCircumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>

            <div className="absolute top-11 flex flex-col items-center text-center">
              <span className="text-2xl font-black text-zinc-900 tracking-tight leading-none">
                {piutangPercent}%
              </span>
              <span className="text-[10px] font-bold text-zinc-500 mt-1">
                Rasio Piutang
              </span>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 font-medium text-center mt-2">
            {totalVolume > BigInt(0)
              ? `Piutang mencakup ${piutangPercent}% dari total akumulasi`
              : "Belum ada transaksi utang piutang"}
          </p>
        </div>

        {/* Right: Bar Chart Comparison */}
        <div className="space-y-4">
          {/* Bar 1: Piutang */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-zinc-700 flex items-center gap-1.5">
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D94E15]" />
                Dihutang ke Saya (Piutang)
              </span>
              <span className="text-zinc-900 font-extrabold">
                {formatRupiah(owedVal)} ({piutangPercent}%)
              </span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-[#D94E15] rounded-md transition-all duration-500"
                style={{ width: `${piutangPercent}%` }}
              />
            </div>
          </div>

          {/* Bar 2: Utang */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-zinc-700 flex items-center gap-1.5">
                <ArrowDownLeft className="w-3.5 h-3.5 text-zinc-500" />
                Saya Hutang (Utang)
              </span>
              <span className="text-zinc-900 font-extrabold">
                {formatRupiah(oweVal)} ({utangPercent}%)
              </span>
            </div>
            <div className="h-3 w-full bg-zinc-100 rounded-md overflow-hidden">
              <div
                className="h-full bg-zinc-400 rounded-md transition-all duration-500"
                style={{ width: `${utangPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Net Summary */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-zinc-50/70 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-[#D94E15]" />
          <span className="font-semibold text-zinc-700">Total Saldo Bersih:</span>
          <span className="font-extrabold text-[#D94E15]">
            {formatRupiah(netVal)}
          </span>
        </div>

        <span className="text-[11px] text-zinc-500 font-medium">
          {isNetPositive
            ? "Posisi keuangan kamu aman (Surplus)"
            : "Kewajiban utang kamu lebih besar (Defisit)"}
        </span>
      </div>
    </div>
  );
}

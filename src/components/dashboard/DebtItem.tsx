"use client";

import { formatRupiah, formatRelativeDate } from "@/lib/utils";
import { CheckCircle2, Edit3, Trash2, ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";

export interface SerializedDebt {
  id: string;
  userId: string;
  type: "owed_to_me" | "i_owe";
  counterpartName: string;
  amount: string;
  note?: string | null;
  dueDate?: string | null;
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface DebtItemProps {
  debt: SerializedDebt;
  onSettle: (id: string) => void;
  onEdit: (debt: SerializedDebt) => void;
  onDelete: (id: string) => void;
  isProcessing?: boolean;
}

export function DebtItem({
  debt,
  onSettle,
  onEdit,
  onDelete,
  isProcessing = false,
}: DebtItemProps) {
  const isSettled = Boolean(debt.settledAt);
  const isOwedToMe = debt.type === "owed_to_me";

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        isSettled
          ? "bg-zinc-50/40 dark:bg-[#121212]/40 border-zinc-200/50 dark:border-zinc-800/50 opacity-75"
          : "bg-white dark:bg-[#181818] border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:border-[#FC5810]/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Person & Details */}
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 border ${
              isOwedToMe
                ? "bg-[#FC5810]/10 text-[#FC5810] border-[#FC5810]/20"
                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
            }`}
          >
            {isOwedToMe ? (
              <ArrowUpRight className="w-4 h-4" />
            ) : (
              <ArrowDownLeft className="w-4 h-4" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {debt.counterpartName}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isOwedToMe
                    ? "bg-[#FC5810]/10 text-[#FC5810] border border-[#FC5810]/20"
                    : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                }`}
              >
                {isOwedToMe ? "Dihutang ke saya" : "Saya hutang"}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  isSettled
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                }`}
              >
                {isSettled ? "Lunas" : "Belum lunas"}
              </span>
            </div>

            {debt.note && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 italic">
                &ldquo;{debt.note}&rdquo;
              </p>
            )}

            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 mt-1.5">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {formatRelativeDate(debt.createdAt)}
              </span>

              {debt.dueDate && (
                <span>Jatuh tempo: {new Date(debt.dueDate).toLocaleDateString("id-ID")}</span>
              )}
            </div>
          </div>
        </div>

        {/* Amount & Action Buttons */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-100 dark:border-zinc-800/80">
          <div
            className={`text-lg font-extrabold ${
              isSettled
                ? "line-through text-zinc-400 dark:text-zinc-500"
                : isOwedToMe
                ? "text-[#FC5810]"
                : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {formatRupiah(BigInt(debt.amount))}
          </div>

          <div className="flex items-center gap-1">
            {!isSettled && (
              <button
                onClick={() => onSettle(debt.id)}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors disabled:opacity-50 cursor-pointer"
                title="Tandai Lunas"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tandai lunas</span>
              </button>
            )}

            <button
              onClick={() => onEdit(debt)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              title="Edit Catatan"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(debt.id)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Hapus Catatan"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

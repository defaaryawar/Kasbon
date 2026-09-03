"use client";

import { formatRupiah, formatRelativeDate } from "@/lib/utils";
import { CheckCircle2, Edit3, Trash2, Clock } from "lucide-react";

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
          ? "bg-zinc-50/60 dark:bg-[#141414] border-zinc-200/60 dark:border-zinc-800/40 opacity-60"
          : "bg-white dark:bg-[#181818] border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:border-[#D94E15]/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Person & Details */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              {debt.counterpartName}
            </h3>

            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              • {isOwedToMe ? "Dihutang ke saya" : "Saya hutang"}
            </span>

            {isSettled && (
              <span className="text-xs text-[#D94E15] font-semibold">
                (Lunas)
              </span>
            )}
          </div>

          {debt.note && (
            <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
              {debt.note}
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

        {/* Amount & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100 dark:border-zinc-800">
          <div
            className={`text-lg font-extrabold ${
              isSettled
                ? "line-through text-zinc-400 dark:text-zinc-500"
                : isOwedToMe
                ? "text-[#D94E15]"
                : "text-zinc-900 dark:text-zinc-200"
            }`}
          >
            {formatRupiah(BigInt(debt.amount))}
          </div>

          <div className="flex items-center gap-1">
            {!isSettled && (
              <button
                onClick={() => onSettle(debt.id)}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D94E15] bg-[#D94E15]/10 hover:bg-[#D94E15]/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lunas</span>
              </button>
            )}

            <button
              onClick={() => onEdit(debt)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(debt.id)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              title="Hapus"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

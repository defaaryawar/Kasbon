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
      className={`p-4 rounded-xl border transition-all ${
        isSettled
          ? "bg-zinc-50 border-zinc-200/70 opacity-65"
          : "bg-white border-zinc-200/90 shadow-2xs hover:border-[#D94E15]/40"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Person & Details */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-zinc-900">
              {debt.counterpartName}
            </h3>

            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-600 border border-zinc-200/80">
              {isOwedToMe ? "Dihutang ke saya" : "Saya hutang"}
            </span>

            {isSettled && (
              <span className="text-[11px] text-[#D94E15] font-bold">
                (Lunas)
              </span>
            )}
          </div>

          {debt.note && (
            <p className="text-xs text-zinc-500 mt-1 italic">
              &ldquo;{debt.note}&rdquo;
            </p>
          )}

          <div className="flex items-center gap-3 text-[11px] text-zinc-400 mt-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              {formatRelativeDate(debt.createdAt)}
            </span>

            {debt.dueDate && (
              <span>Jatuh tempo: {new Date(debt.dueDate).toLocaleDateString("id-ID")}</span>
            )}
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-100">
          <div
            className={`text-base font-extrabold ${
              isSettled
                ? "line-through text-zinc-400"
                : isOwedToMe
                ? "text-[#D94E15]"
                : "text-zinc-900"
            }`}
          >
            {formatRupiah(BigInt(debt.amount))}
          </div>

          <div className="flex items-center gap-1">
            {!isSettled && (
              <button
                onClick={() => onSettle(debt.id)}
                disabled={isProcessing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-[#D94E15] bg-[#D94E15]/10 hover:bg-[#D94E15]/20 border border-[#D94E15]/20 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Lunas</span>
              </button>
            )}

            <button
              onClick={() => onEdit(debt)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Edit"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onDelete(debt.id)}
              disabled={isProcessing}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

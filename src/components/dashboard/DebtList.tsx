"use client";

import { SerializedDebt, DebtItem } from "./DebtItem";
import { Receipt } from "lucide-react";

interface DebtListProps {
  debts: SerializedDebt[];
  isLoading: boolean;
  onSettle: (id: string) => void;
  onEdit: (debt: SerializedDebt) => void;
  onDelete: (id: string) => void;
  processingId?: string | null;
}

export function DebtList({
  debts,
  isLoading,
  onSettle,
  onEdit,
  onDelete,
  processingId,
}: DebtListProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800/60 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-2xl bg-white dark:bg-[#181818] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-xs">
        <Receipt className="w-7 h-7 text-zinc-400 mb-2" />
        <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
          Belum ada catatan transaksi.
        </h3>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {debts.map((debt) => (
        <DebtItem
          key={debt.id}
          debt={debt}
          onSettle={onSettle}
          onEdit={onEdit}
          onDelete={onDelete}
          isProcessing={processingId === debt.id}
        />
      ))}
    </div>
  );
}

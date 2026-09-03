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
            className="h-20 rounded-xl bg-white border border-zinc-200/80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center rounded-xl bg-white border border-dashed border-zinc-200/90 shadow-2xs">
        <Receipt className="w-7 h-7 text-zinc-400 mb-2" />
        <h3 className="text-xs font-bold text-zinc-700">
          Belum ada catatan transaksi.
        </h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Klik &ldquo;+ Catat Baru&rdquo; untuk menambahkan catatan utang atau piutang pertama kamu.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
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

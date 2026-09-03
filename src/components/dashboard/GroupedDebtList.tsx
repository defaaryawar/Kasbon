"use client";

import { useState } from "react";
import { SerializedDebt, DebtItem } from "./DebtItem";
import { formatRupiah } from "@/lib/utils";
import { Users, ChevronDown, ChevronUp, User } from "lucide-react";

interface GroupedDebtListProps {
  debts: SerializedDebt[];
  isLoading: boolean;
  onSettle: (id: string) => void;
  onEdit: (debt: SerializedDebt) => void;
  onDelete: (id: string) => void;
  processingId?: string | null;
}

interface PersonGroup {
  name: string;
  totalOwedToMe: bigint;
  totalIOwe: bigint;
  net: bigint;
  items: SerializedDebt[];
  unsettledCount: number;
}

export function GroupedDebtList({
  debts,
  isLoading,
  onSettle,
  onEdit,
  onDelete,
  processingId,
}: GroupedDebtListProps) {
  const [expandedNames, setExpandedNames] = useState<Record<string, boolean>>({});

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-white dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="p-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-3">
          <Users className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
          Tidak ada grup transaksi
        </h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
          Pencatatan utang piutang akan dikelompokkan secara otomatis berdasarkan nama orang.
        </p>
      </div>
    );
  }

  // Group debts by counterpartName (case-insensitive key)
  const groupsMap = new Map<string, PersonGroup>();

  for (const debt of debts) {
    const key = debt.counterpartName.trim().toLowerCase();
    const existing = groupsMap.get(key);

    const amt = BigInt(debt.amount);
    const isUnsettled = !debt.settledAt;

    if (!existing) {
      groupsMap.set(key, {
        name: debt.counterpartName.trim(),
        totalOwedToMe: debt.type === "owed_to_me" && isUnsettled ? amt : BigInt(0),
        totalIOwe: debt.type === "i_owe" && isUnsettled ? amt : BigInt(0),
        net: (debt.type === "owed_to_me" && isUnsettled ? amt : BigInt(0)) - (debt.type === "i_owe" && isUnsettled ? amt : BigInt(0)),
        items: [debt],
        unsettledCount: isUnsettled ? 1 : 0,
      });
    } else {
      existing.items.push(debt);
      if (isUnsettled) {
        existing.unsettledCount += 1;
        if (debt.type === "owed_to_me") existing.totalOwedToMe += amt;
        if (debt.type === "i_owe") existing.totalIOwe += amt;
      }
      existing.net = existing.totalOwedToMe - existing.totalIOwe;
    }
  }

  const groups = Array.from(groupsMap.values());

  const toggleExpand = (name: string) => {
    setExpandedNames((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <div className="space-y-4">
      {groups.map((group) => {
        const isExpanded = expandedNames[group.name] ?? true;
        const isNetPositive = group.net >= BigInt(0);

        return (
          <div
            key={group.name}
            className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden"
          >
            {/* Group Header */}
            <div
              onClick={() => toggleExpand(group.name)}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/70 dark:bg-zinc-800/40 cursor-pointer hover:bg-zinc-100/80 dark:hover:bg-zinc-800/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                      {group.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-200/70 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300">
                      {group.items.length} transaksi
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {group.unsettledCount > 0
                      ? `${group.unsettledCount} transaksi belum lunas`
                      : "Semua transaksi lunas 👍"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200/60 dark:border-zinc-700/60">
                <div className="text-right">
                  <div className="text-xs text-zinc-400">Saldo Bersih (Net)</div>
                  <div
                    className={`text-base font-extrabold ${
                      isNetPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {formatRupiah(group.net)}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
            </div>

            {/* Group Items */}
            {isExpanded && (
              <div className="p-4 space-y-3 border-t border-zinc-100 dark:border-zinc-800">
                {group.items.map((debt) => (
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
            )}
          </div>
        );
      })}
    </div>
  );
}

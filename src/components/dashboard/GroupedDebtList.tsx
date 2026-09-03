"use client";

import { useState } from "react";
import { SerializedDebt, DebtItem } from "./DebtItem";
import { formatRupiah } from "@/lib/utils";
import { ChevronDown, ChevronUp, User } from "lucide-react";

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
            className="h-20 rounded-2xl bg-[#181818] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (debts.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-[#181818] border border-dashed border-zinc-800 text-zinc-400 text-xs">
        Belum ada catatan transaksi.
      </div>
    );
  }

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
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedNames[group.name] ?? true;

        return (
          <div
            key={group.name}
            className="rounded-2xl border border-zinc-800/80 bg-[#181818] overflow-hidden"
          >
            {/* Group Header */}
            <div
              onClick={() => toggleExpand(group.name)}
              className="p-4 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-zinc-800 text-[#D94E15]">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {group.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {group.items.length} transaksi ({group.unsettledCount} belum lunas)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-zinc-500">Net</div>
                  <div className="text-sm font-extrabold text-[#D94E15]">
                    {formatRupiah(group.net)}
                  </div>
                </div>

                <div className="text-zinc-500">
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Group Items */}
            {isExpanded && (
              <div className="p-4 space-y-3 border-t border-zinc-800/80 bg-[#141414]">
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

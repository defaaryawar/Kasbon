export type DebtType = "owed_to_me" | "i_owe";

export interface DebtEntity {
  id: string;
  userId: string;
  type: DebtType;
  counterpartName: string;
  amount: bigint;
  note?: string | null;
  dueDate?: string | null;
  settledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SummaryOverview {
  totalOwedToMe: bigint;
  totalIOwe: bigint;
  net: bigint;
}

export interface DebtFilterOptions {
  status?: "all" | "unsettled" | "settled";
  type?: "all" | "owed_to_me" | "i_owe";
  search?: string;
}

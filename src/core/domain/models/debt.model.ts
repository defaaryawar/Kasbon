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

export type DebtSortOption = "created_desc" | "created_asc" | "amount_desc" | "amount_asc";

export interface DebtFilterOptions {
  status?: "all" | "unsettled" | "settled";
  type?: "all" | "owed_to_me" | "i_owe";
  search?: string;
  sort?: DebtSortOption;
}

export interface GroupedDebtPerson {
  counterpartName: string;
  totalOwedToMe: bigint;
  totalIOwe: bigint;
  net: bigint;
  count: number;
  unsettledCount: number;
  items: DebtEntity[];
}

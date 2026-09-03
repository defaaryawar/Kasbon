import { DebtEntity, DebtFilterOptions, SummaryOverview } from "@/core/domain/models/debt.model";

export interface DebtRepositoryPort {
  findAll(userId: string, filters?: DebtFilterOptions): Promise<DebtEntity[]>;
  findById(id: string, userId: string): Promise<DebtEntity | null>;
  create(userId: string, data: Omit<DebtEntity, "id" | "userId" | "createdAt" | "updatedAt">): Promise<DebtEntity>;
  update(id: string, userId: string, data: Partial<Omit<DebtEntity, "id" | "userId" | "createdAt" | "updatedAt">>): Promise<DebtEntity>;
  settle(id: string, userId: string): Promise<DebtEntity>;
  delete(id: string, userId: string): Promise<void>;
  getSummary(userId: string): Promise<SummaryOverview>;
}

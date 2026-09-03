import { DebtRepositoryPort } from "@/application/ports/debt-repository.port";
import { DebtEntity, DebtFilterOptions, SummaryOverview } from "@/core/domain/models/debt.model";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseDebtRepository implements DebtRepositoryPort {
  constructor(private readonly supabase: SupabaseClient) {}

  async findAll(userId: string, filters?: DebtFilterOptions): Promise<DebtEntity[]> {
    let query = this.supabase
      .from("debts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (filters?.status === "settled") {
      query = query.not("settled_at", "is", null);
    } else if (filters?.status === "unsettled") {
      query = query.is("settled_at", null);
    }

    if (filters?.type && filters.type !== "all") {
      query = query.eq("type", filters.type);
    }

    if (filters?.search && filters.search.trim() !== "") {
      query = query.ilike("counterpart_name", `%${filters.search.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Gagal mengambil data utang-piutang: ${error.message}`);
    }

    return (data || []).map(this.mapToEntity);
  }

  async findById(id: string, userId: string): Promise<DebtEntity | null> {
    const { data, error } = await this.supabase
      .from("debts")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async create(
    userId: string,
    data: Omit<DebtEntity, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<DebtEntity> {
    const { data: created, error } = await this.supabase
      .from("debts")
      .insert({
        user_id: userId,
        type: data.type,
        counterpart_name: data.counterpartName,
        amount: data.amount.toString(),
        note: data.note || null,
        due_date: data.dueDate || null,
        settled_at: data.settledAt || null,
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal mencatat transaksi: ${error.message}`);
    }

    return this.mapToEntity(created);
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Omit<DebtEntity, "id" | "userId" | "createdAt" | "updatedAt">>
  ): Promise<DebtEntity> {
    const updatePayload: Record<string, unknown> = {};
    if (data.type !== undefined) updatePayload.type = data.type;
    if (data.counterpartName !== undefined) updatePayload.counterpart_name = data.counterpartName;
    if (data.amount !== undefined) updatePayload.amount = data.amount.toString();
    if (data.note !== undefined) updatePayload.note = data.note;
    if (data.dueDate !== undefined) updatePayload.due_date = data.dueDate;
    if (data.settledAt !== undefined) updatePayload.settled_at = data.settledAt;

    const { data: updated, error } = await this.supabase
      .from("debts")
      .update(updatePayload)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal memperbarui transaksi: ${error.message}`);
    }

    return this.mapToEntity(updated);
  }

  async settle(id: string, userId: string): Promise<DebtEntity> {
    const { data: updated, error } = await this.supabase
      .from("debts")
      .update({ settled_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      throw new Error(`Gagal menandai lunas: ${error.message}`);
    }

    return this.mapToEntity(updated);
  }

  async delete(id: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from("debts")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      throw new Error(`Gagal menghapus catatan: ${error.message}`);
    }
  }

  async getSummary(userId: string): Promise<SummaryOverview> {
    const { data, error } = await this.supabase
      .from("debts")
      .select("type, amount, settled_at")
      .eq("user_id", userId)
      .is("settled_at", null);

    if (error) {
      throw new Error(`Gagal menghitung ringkasan total: ${error.message}`);
    }

    let totalOwedToMe = BigInt(0);
    let totalIOwe = BigInt(0);

    for (const row of data || []) {
      const amt = BigInt(row.amount);
      if (row.type === "owed_to_me") {
        totalOwedToMe += amt;
      } else if (row.type === "i_owe") {
        totalIOwe += amt;
      }
    }

    return {
      totalOwedToMe,
      totalIOwe,
      net: totalOwedToMe - totalIOwe,
    };
  }

  private mapToEntity(row: Record<string, unknown>): DebtEntity {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      type: row.type as DebtEntity["type"],
      counterpartName: String(row.counterpart_name),
      amount: BigInt(String(row.amount)),
      note: row.note ? String(row.note) : null,
      dueDate: row.due_date ? String(row.due_date) : null,
      settledAt: row.settled_at ? String(row.settled_at) : null,
      createdAt: String(row.created_at),
      updatedAt: String(row.updated_at),
    };
  }
}

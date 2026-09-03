import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/infrastructure/supabase/server";
import { SupabaseDebtRepository } from "@/infrastructure/supabase/repositories/supabase-debt.repository";
import { debtFormSchema } from "@/lib/validations/debt.schema";
import { domainEventBus } from "@/core/events/event-bus";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesi tidak valid. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const typeParam = searchParams.get("type");
    const searchParam = searchParams.get("search");
    const sortParam = searchParams.get("sort");

    const repository = new SupabaseDebtRepository(supabase);
    const debts = await repository.findAll(user.id, {
      status: (statusParam as "all" | "unsettled" | "settled") || "all",
      type: (typeParam as "all" | "owed_to_me" | "i_owe") || "all",
      search: searchParam || undefined,
      sort: (sortParam as "created_desc" | "created_asc" | "amount_desc" | "amount_asc") || "created_desc",
    });

    const summary = await repository.getSummary(user.id);

    const serializedDebts = debts.map((d) => ({
      ...d,
      amount: d.amount.toString(),
    }));

    return NextResponse.json({
      data: serializedDebts,
      summary: {
        totalOwedToMe: summary.totalOwedToMe.toString(),
        totalIOwe: summary.totalIOwe.toString(),
        net: summary.net.toString(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Terjadi kesalahan server";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesi tidak valid. Silakan login terlebih dahulu." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parseResult = debtFormSchema.safeParse(body);

    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Data input tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validatedData = parseResult.data;
    const repository = new SupabaseDebtRepository(supabase);

    const created = await repository.create(user.id, {
      type: validatedData.type,
      counterpartName: validatedData.counterpart_name,
      amount: BigInt(validatedData.amount),
      note: validatedData.note,
      dueDate: validatedData.due_date,
    });

    await domainEventBus.publish({
      eventId: crypto.randomUUID(),
      eventType: "DEBT_CREATED",
      occurredAt: new Date(),
      userId: user.id,
      payload: {
        debtId: created.id,
        type: created.type,
        amount: created.amount,
        counterpartName: created.counterpartName,
      },
    });

    return NextResponse.json(
      {
        message: "Berhasil mencatat transaksi baru",
        data: {
          ...created,
          amount: created.amount.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menambahkan catatan utang";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

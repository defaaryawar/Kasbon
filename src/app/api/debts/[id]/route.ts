import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/infrastructure/supabase/server";
import { SupabaseDebtRepository } from "@/infrastructure/supabase/repositories/supabase-debt.repository";
import { updateDebtFormSchema, uuidParamSchema } from "@/lib/validations/debt.schema";
import { domainEventBus } from "@/core/events/event-bus";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const idValidation = uuidParamSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "Format ID transaksi tidak valid" },
        { status: 400 }
      );
    }
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

    const repository = new SupabaseDebtRepository(supabase);
    const existing = await repository.findById(id, user.id);

    if (!existing) {
      return NextResponse.json(
        { error: "Catatan utang tidak ditemukan atau Anda tidak memiliki akses." },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.action === "settle" || body.settled === true) {
      const settled = await repository.settle(id, user.id);

      await domainEventBus.publish({
        eventId: crypto.randomUUID(),
        eventType: "DEBT_SETTLED",
        occurredAt: new Date(),
        userId: user.id,
        payload: {
          debtId: settled.id,
          settledAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "Transaksi berhasil ditandai lunas",
        data: {
          ...settled,
          amount: settled.amount.toString(),
        },
      });
    }

    const parseResult = updateDebtFormSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0]?.message || "Data input tidak valid";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const validatedData = parseResult.data;

    const updated = await repository.update(id, user.id, {
      ...(validatedData.type && { type: validatedData.type }),
      ...(validatedData.counterpart_name && { counterpartName: validatedData.counterpart_name }),
      ...(validatedData.amount !== undefined && { amount: BigInt(validatedData.amount) }),
      ...(validatedData.note !== undefined && { note: validatedData.note }),
      ...(validatedData.due_date !== undefined && { dueDate: validatedData.due_date }),
    });

    await domainEventBus.publish({
      eventId: crypto.randomUUID(),
      eventType: "DEBT_UPDATED",
      occurredAt: new Date(),
      userId: user.id,
      payload: {
        debtId: updated.id,
        type: updated.type,
        amount: updated.amount,
        counterpartName: updated.counterpartName,
      },
    });

    return NextResponse.json({
      message: "Transaksi berhasil diperbarui",
      data: {
        ...updated,
        amount: updated.amount.toString(),
      },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal memperbarui transaksi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const idValidation = uuidParamSchema.safeParse(id);
    if (!idValidation.success) {
      return NextResponse.json(
        { error: "Format ID transaksi tidak valid" },
        { status: 400 }
      );
    }
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

    const repository = new SupabaseDebtRepository(supabase);
    const existing = await repository.findById(id, user.id);

    if (!existing) {
      return NextResponse.json(
        { error: "Catatan utang tidak ditemukan atau Anda tidak memiliki akses." },
        { status: 404 }
      );
    }

    await repository.delete(id, user.id);

    await domainEventBus.publish({
      eventId: crypto.randomUUID(),
      eventType: "DEBT_DELETED",
      occurredAt: new Date(),
      userId: user.id,
      payload: { debtId: id },
    });

    return NextResponse.json({
      message: "Catatan transaksi berhasil dihapus",
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Gagal menghapus transaksi";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

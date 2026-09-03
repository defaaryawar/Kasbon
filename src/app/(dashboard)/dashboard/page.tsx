import { createClient } from "@/infrastructure/supabase/server";
import { SupabaseDebtRepository } from "@/infrastructure/supabase/repositories/supabase-debt.repository";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { redirect } from "next/navigation";
import { SerializedDebt } from "@/components/dashboard/DebtItem";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userEmail = user.email || "";
  const userName =
    user.user_metadata?.full_name ||
    user.user_metadata?.display_name ||
    userEmail;
  const userPhone =
    user.user_metadata?.phone_number ||
    user.user_metadata?.phone ||
    user.phone ||
    "";

  let initialDebts: SerializedDebt[] = [];
  let initialSummary = {
    totalOwedToMe: "0",
    totalIOwe: "0",
    net: "0",
  };

  try {
    const repository = new SupabaseDebtRepository(supabase);
    const rawDebts = await repository.findAll(user.id);
    const rawSummary = await repository.getSummary(user.id);

    initialDebts = rawDebts.map((d) => ({
      id: d.id,
      userId: d.userId,
      type: d.type,
      counterpartName: d.counterpartName,
      amount: d.amount.toString(),
      note: d.note,
      dueDate: d.dueDate,
      settledAt: d.settledAt,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    }));

    initialSummary = {
      totalOwedToMe: rawSummary.totalOwedToMe.toString(),
      totalIOwe: rawSummary.totalIOwe.toString(),
      net: rawSummary.net.toString(),
    };
  } catch (error) {
    console.error("Error loading server-side dashboard data:", error);
  }

  return (
    <DashboardClient
      userEmail={userEmail}
      userName={userName}
      userPhone={userPhone}
      initialDebts={initialDebts}
      initialSummary={initialSummary}
    />
  );
}

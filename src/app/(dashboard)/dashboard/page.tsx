"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { DebtBarChart } from "@/components/dashboard/DebtBarChart";
import { DebtFilter } from "@/components/dashboard/DebtFilter";
import { DebtList } from "@/components/dashboard/DebtList";
import { GroupedDebtList } from "@/components/dashboard/GroupedDebtList";
import { DebtModal } from "@/components/form/DebtModal";
import { SerializedDebt } from "@/components/dashboard/DebtItem";
import { createClient } from "@/infrastructure/supabase/client";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [debts, setDebts] = useState<SerializedDebt[]>([]);
  const [summary, setSummary] = useState({
    totalOwedToMe: "0",
    totalIOwe: "0",
    net: "0",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("created_desc");
  const [viewMode, setViewMode] = useState<"list" | "grouped">("list");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<SerializedDebt | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);
    };
    fetchUser();
  }, []);

  const fetchDebts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (searchQuery.trim() !== "") params.set("search", searchQuery.trim());
      if (sortOption !== "created_desc") params.set("sort", sortOption);

      const res = await fetch(`/api/debts?${params.toString()}`);
      const json = await res.json();

      if (res.ok) {
        setDebts(json.data || []);
        setSummary(
          json.summary || { totalOwedToMe: "0", totalIOwe: "0", net: "0" }
        );
      }
    } catch (error) {
      console.error("Error fetching debts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, typeFilter, searchQuery, sortOption]);

  useEffect(() => {
    fetchDebts();
  }, [fetchDebts]);

  const handleSettle = async (id: string) => {
    try {
      setProcessingId(id);
      const res = await fetch(`/api/debts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "settle" }),
      });

      if (res.ok) {
        await fetchDebts();
      }
    } catch (error) {
      console.error("Error settling debt:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah kamu yakin ingin menghapus catatan transaksi ini?")) {
      return;
    }

    try {
      setProcessingId(id);
      const res = await fetch(`/api/debts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchDebts();
      }
    } catch (error) {
      console.error("Error deleting debt:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenCreate = () => {
    setEditingDebt(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (debt: SerializedDebt) => {
    setEditingDebt(debt);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-zinc-900 flex flex-col md:flex-row">
      <Sidebar
        userEmail={userEmail}
        isCollapsed={isSidebarCollapsed}
        onOpenCreateModal={handleOpenCreate}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userEmail={userEmail}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-8 pt-6 pb-12">
          {/* Row 1: Summary Cards */}
          <SummaryCards
            totalOwedToMe={summary.totalOwedToMe}
            totalIOwe={summary.totalIOwe}
            net={summary.net}
          />

          {/* Row 2: Sleek Gauge Chart */}
          <DebtBarChart
            totalOwedToMe={summary.totalOwedToMe}
            totalIOwe={summary.totalIOwe}
          />

          {/* Row 3: Filter Toolbar */}
          <DebtFilter
            statusFilter={statusFilter}
            typeFilter={typeFilter}
            searchQuery={searchQuery}
            sortOption={sortOption}
            viewMode={viewMode}
            onStatusChange={setStatusFilter}
            onTypeChange={setTypeFilter}
            onSearchChange={setSearchQuery}
            onSortChange={setSortOption}
            onViewModeChange={setViewMode}
          />

          {/* Row 4: Debt List / Grouped List */}
          {viewMode === "list" ? (
            <DebtList
              debts={debts}
              isLoading={isLoading}
              onSettle={handleSettle}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              processingId={processingId}
            />
          ) : (
            <GroupedDebtList
              debts={debts}
              isLoading={isLoading}
              onSettle={handleSettle}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              processingId={processingId}
            />
          )}
        </main>
      </div>

      <DebtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDebts}
        initialData={editingDebt}
      />
    </div>
  );
}

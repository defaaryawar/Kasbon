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
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { SerializedDebt } from "@/components/dashboard/DebtItem";
import { createClient } from "@/infrastructure/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Trash2, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
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

  const [deletingDebt, setDeletingDebt] = useState<SerializedDebt | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        if (user.email) setUserEmail(user.email);
        const nameFromMeta = user.user_metadata?.full_name || user.user_metadata?.display_name;
        if (nameFromMeta) setUserName(nameFromMeta);
        const phoneFromMeta = user.user_metadata?.phone_number || user.user_metadata?.phone || user.phone;
        if (phoneFromMeta) setUserPhone(phoneFromMeta);
      }
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
        toast.success("Transaksi berhasil ditandai lunas!", {
          icon: <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />,
        });
        await fetchDebts();
      } else {
        toast.error("Gagal mengubah status lunas", {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        });
      }
    } catch (error) {
      console.error("Error settling debt:", error);
      toast.error("Terjadi kesalahan koneksi", {
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      });
    } finally {
      setProcessingId(null);
    }
  };

  const onRequestDelete = (id: string) => {
    const target = debts.find((d) => d.id === id);
    if (target) {
      setDeletingDebt(target);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingDebt) return;

    try {
      setIsDeleting(true);
      setProcessingId(deletingDebt.id);

      const res = await fetch(`/api/debts/${deletingDebt.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success(`Catatan transaksi dengan ${deletingDebt.counterpartName} berhasil dihapus`, {
          icon: <Trash2 className="w-4 h-4 text-[#D94E15]" />,
        });
        setDeletingDebt(null);
        await fetchDebts();
      } else {
        toast.error("Gagal menghapus catatan transaksi", {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        });
      }
    } catch (error) {
      console.error("Error deleting debt:", error);
      toast.error("Terjadi kesalahan koneksi saat menghapus", {
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      });
    } finally {
      setIsDeleting(false);
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
        userName={userName}
        isCollapsed={isSidebarCollapsed}
        onOpenCreateModal={handleOpenCreate}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          userEmail={userEmail}
          userName={userName}
          userPhone={userPhone}
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
              onDelete={onRequestDelete}
              processingId={processingId}
            />
          ) : (
            <GroupedDebtList
              debts={debts}
              isLoading={isLoading}
              onSettle={handleSettle}
              onEdit={handleOpenEdit}
              onDelete={onRequestDelete}
              processingId={processingId}
            />
          )}
        </main>
      </div>

      {/* Modal Form Create/Edit */}
      <DebtModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDebts}
        initialData={editingDebt}
      />

      {/* Custom Confirmation Modal for Deleting Debt */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingDebt)}
        onClose={() => setDeletingDebt(null)}
        onConfirm={handleConfirmDelete}
        counterpartName={deletingDebt?.counterpartName}
        isDeleting={isDeleting}
      />
    </div>
  );
}

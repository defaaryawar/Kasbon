"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import { LayoutDashboard, Plus, LogOut, Menu, X, Receipt, Settings, Sparkles } from "lucide-react";

interface SidebarProps {
  userEmail: string;
  isCollapsed: boolean;
  onOpenCreateModal: () => void;
}

export function Sidebar({ userEmail, isCollapsed, onOpenCreateModal }: SidebarProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const initial = userEmail ? userEmail[0].toUpperCase() : "U";

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-white border-b border-zinc-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-base shadow-xs">
            K
          </div>
          <span className="text-lg font-extrabold text-zinc-900">
            Kasbon<span className="text-[#D94E15]">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D94E15] text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Baru</span>
          </button>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 bg-zinc-100 cursor-pointer"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm animate-in fade-in"
        />
      )}

      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen bg-white border-r border-zinc-200/90 flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        } ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="space-y-6">
          {/* Brand Logo Header */}
          <div
            className={`flex items-center h-10 ${isCollapsed ? "justify-center" : "gap-3 px-1"}`}
          >
            <div className="w-9 h-9 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-lg shadow-md shadow-[#D94E15]/20 shrink-0">
              K
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <span className="text-xl font-extrabold tracking-tight text-zinc-900">
                  Kasbon<span className="text-[#D94E15]">.</span>
                </span>
                <p className="text-[11px] text-zinc-400 font-medium leading-none mt-0.5">
                  Personal Debt Tracker
                </p>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              onOpenCreateModal();
              setIsMobileOpen(false);
            }}
            title="Catat Baru"
            className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] text-white font-semibold text-sm transition-all shadow-xs cursor-pointer ${
              isCollapsed ? "px-0" : "px-4"
            }`}
          >
            <Plus className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Catat Baru</span>}
          </button>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            {!isCollapsed && (
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                MENU
              </div>
            )}
            {/* Active Item: Dashboard */}
            <a
              href="/dashboard"
              title="Dashboard"
              className={`flex items-center gap-3 py-2.5 rounded-xl bg-[#FFF4ED] text-[#D94E15] font-bold text-sm border border-[#FED7AA]/50 ${
                isCollapsed ? "justify-center px-0" : "px-3.5"
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-[#D94E15] shrink-0" />
              {!isCollapsed && <span>Dashboard</span>}
            </a>

            {/* Coming Soon Item 1: Tabel Transaksi */}
            <div className="relative group">
              <div
                className={`flex items-center gap-3 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-50 font-medium text-sm transition-colors cursor-not-allowed ${
                  isCollapsed ? "justify-center px-0" : "px-3.5"
                }`}
              >
                <Receipt className="w-4.5 h-4.5 shrink-0 text-zinc-400" />
                {!isCollapsed && <span>Tabel Transaksi</span>}
              </div>

              {/* Clean White Light Theme Tooltip with Lucide Sparkles Icon */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                <div className="w-2 h-2 bg-white border-b border-l border-zinc-200 rotate-45 -mr-1 shrink-0 z-10" />
                <div className="bg-white text-zinc-900 border border-zinc-200/90 text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D94E15] shrink-0" />
                  <span>Fitur Tabel Transaksi sedang dalam pengembangan</span>
                </div>
              </div>
            </div>

            {/* Coming Soon Item 2: Pengaturan */}
            <div className="relative group">
              <div
                className={`flex items-center gap-3 py-2.5 rounded-xl text-zinc-400 hover:bg-zinc-50 font-medium text-sm transition-colors cursor-not-allowed ${
                  isCollapsed ? "justify-center px-0" : "px-3.5"
                }`}
              >
                <Settings className="w-4.5 h-4.5 shrink-0 text-zinc-400" />
                {!isCollapsed && <span>Pengaturan</span>}
              </div>

              {/* Clean White Light Theme Tooltip with Lucide Sparkles Icon */}
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                <div className="w-2 h-2 bg-white border-b border-l border-zinc-200 rotate-45 -mr-1 shrink-0 z-10" />
                <div className="bg-white text-zinc-900 border border-zinc-200/90 text-[11px] font-semibold px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D94E15] shrink-0" />
                  <span>Fitur Pengaturan sedang dalam pengembangan</span>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Profile Avatar & Logout */}
        <div className="pt-4 border-t border-zinc-100 space-y-3">
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3 px-1"}`}>
            <div className="w-9 h-9 rounded-full bg-[#D94E15] text-white flex items-center justify-center font-extrabold text-xs shadow-xs ring-2 ring-[#D94E15]/20 shrink-0">
              {initial}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-zinc-900 truncate">
                  {userEmail || "Pengguna"}
                </p>
                <p className="text-[10px] text-zinc-400 font-medium">Akun Terhubung</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            title="Logout"
            className={`w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-50 cursor-pointer rounded-xl ${
              isCollapsed ? "px-0" : "px-3"
            }`}
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            {!isCollapsed && <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

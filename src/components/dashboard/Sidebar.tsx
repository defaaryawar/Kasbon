"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import {
  LayoutDashboard,
  Plus,
  LogOut,
  Menu,
  X,
} from "lucide-react";

interface SidebarProps {
  userEmail: string;
  onOpenCreateModal: () => void;
}

export function Sidebar({ userEmail, onOpenCreateModal }: SidebarProps) {
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
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-16 bg-white dark:bg-[#181818] border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-base">
            K
          </div>
          <span className="text-lg font-extrabold text-zinc-900 dark:text-white">
            Kasbon<span className="text-[#D94E15]">.</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#D94E15] text-white text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Catat Baru</span>
          </button>

          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 cursor-pointer"
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

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 h-screen w-60 bg-white dark:bg-[#181818] border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between p-5 transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-1 pt-1">
            <div className="w-9 h-9 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-lg shadow-md shadow-[#D94E15]/20">
              K
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                Kasbon<span className="text-[#D94E15]">.</span>
              </span>
              <p className="text-[11px] text-zinc-500 font-medium leading-none mt-0.5">
                Personal Debt Tracker
              </p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              onOpenCreateModal();
              setIsMobileOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] text-white font-semibold text-sm transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Baru</span>
          </button>

          {/* Navigation */}
          <nav className="space-y-1">
            <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Menu Utama
            </div>
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#D94E15]/10 text-[#D94E15] font-semibold text-sm border border-[#D94E15]/20"
            >
              <LayoutDashboard className="w-4.5 h-4.5 text-[#D94E15]" />
              <span>Dashboard</span>
            </a>
          </nav>
        </div>

        {/* Bottom Profile Avatar & Logout */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          <div className="flex items-center gap-3 px-1">
            <div className="w-9 h-9 rounded-full bg-[#D94E15] text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {initial}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200 truncate">
                {userEmail || "Pengguna"}
              </p>
              <p className="text-xs text-zinc-500">Akun Terhubung</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

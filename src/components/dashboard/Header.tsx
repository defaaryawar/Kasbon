"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import { LogOut, ChevronDown, PanelLeftClose, PanelLeftOpen, Phone } from "lucide-react";

interface HeaderProps {
  userEmail: string;
  userName?: string;
  userPhone?: string;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({
  userEmail,
  userName,
  userPhone,
  isSidebarCollapsed,
  onToggleSidebar,
}: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      setIsLoggingOut(false);
    }
  };

  const displayName = userName || userEmail || "Pengguna";
  const initial = displayName ? displayName[0].toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-white border-b border-zinc-200/90 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        {/* Sidebar Collapse/Expand Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          title={isSidebarCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-extrabold text-zinc-900 tracking-tight leading-none">
            Dashboard
          </h1>
          <p className="text-[11px] text-zinc-500 font-medium hidden sm:block mt-0.5">
            Kelola pencatatan utang & piutang pribadi kamu
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* User Profile Trigger */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#D94E15] text-white flex items-center justify-center font-extrabold text-xs shadow-xs ring-2 ring-[#D94E15]/20 shrink-0">
              {initial}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-zinc-800 max-w-[160px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />

              <div className="absolute right-0 mt-2 w-60 p-2 rounded-2xl bg-white border border-zinc-200 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-zinc-100 mb-1 space-y-0.5">
                  <p className="text-xs font-bold text-zinc-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-zinc-400 font-medium truncate">
                    {userEmail}
                  </p>
                  {userPhone && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 pt-0.5">
                      <Phone className="w-3 h-3 text-[#D94E15]" />
                      <span>{userPhone}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isLoggingOut ? "Mengeluarkan..." : "Logout"}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

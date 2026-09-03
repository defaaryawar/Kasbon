"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import { LogOut, ChevronDown } from "lucide-react";

interface HeaderProps {
  userEmail: string;
}

export function Header({ userEmail }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/60 mb-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <h1 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white tracking-tight">
          Dashboard Utang Piutang
        </h1>

        {/* Profile Trigger (Clean & Borderless) */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#D94E15] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#D94E15]/20 shrink-0">
              {initial}
            </div>
            <span className="hidden sm:inline max-w-[160px] truncate">
              {userEmail}
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Interactive Profile Dropdown Menu */}
          {isOpen && (
            <>
              <div
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 z-40"
              />

              <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#181818] border border-zinc-200 dark:border-zinc-800 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <p className="text-[11px] text-zinc-400 font-medium">Masuk sebagai</p>
                  <p className="text-xs font-bold text-zinc-900 dark:text-white truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer disabled:opacity-50"
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

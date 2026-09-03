"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import { authFormSchema } from "@/lib/validations/debt.schema";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isLogin = mode === "login";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const parseResult = authFormSchema.safeParse({ email, password });
    if (!parseResult.success) {
      setErrorMessage(
        parseResult.error.issues[0]?.message || "Input tidak valid"
      );
      return;
    }

    try {
      setIsLoading(true);
      const supabase = createClient();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;
        setSuccessMessage("Akun berhasil dibuat! Mengalihkan ke login...");
        setTimeout(() => router.push("/login"), 1200);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Email atau password salah");
          }
          throw error;
        }

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan autentikasi"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hero Section (Only visible on Desktop lg:flex)
  const HeroSection = (
    <motion.div
      key={`hero-${mode}`}
      initial={{ opacity: 0, x: isLogin ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col justify-between p-10 bg-[#181818] rounded-3xl relative overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#FC5810]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#FC5810]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-9 h-9 rounded-xl bg-[#FC5810] flex items-center justify-center font-black text-white text-lg">
          K
        </div>
        <span className="text-xl font-extrabold tracking-tight text-white">
          Kasbon<span className="text-[#FC5810]">.</span>
        </span>
      </div>

      {/* Main Copy */}
      <div className="my-10 space-y-4 z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
          Kelola utang & piutang <br />
          <span className="text-[#FC5810]">tanpa ribet.</span>
        </h2>
        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
          Catat siapa hutang berapa, pantau saldo net kamu secara realtime, dan kelola keuangan pribadi dengan simpel dan rapi.
        </p>

        <div className="pt-3 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#FC5810]" />
            <span>Kalkulasi Saldo Net Utang/Piutang Otomatis</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#FC5810]" />
            <span>Format Rupiah (id-ID) & Waktu Relatif</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#FC5810]" />
            <span>Isolasi Data Aman dengan PostgreSQL RLS</span>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="pt-6 border-t border-zinc-800/80 text-xs text-zinc-500 z-10">
        © Kasbon. Personal Debt Tracker System.
      </div>
    </motion.div>
  );

  // Form Section (Cardless & Responsive)
  const FormSection = (
    <motion.div
      key={`form-${mode}`}
      initial={{ opacity: 0, x: isLogin ? 30 : -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 w-full"
    >
      <div className="w-full max-w-sm mx-auto">
        {/* Mobile-only Brand Header */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-xl bg-[#FC5810] flex items-center justify-center font-black text-white text-base">
            K
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            Kasbon<span className="text-[#FC5810]">.</span>
          </span>
        </div>

        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {isLogin ? "Selamat Datang Kembali" : "Buat Akun Baru"}
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {isLogin
              ? "Masukkan email dan password kamu untuk masuk."
              : "Daftar sekarang untuk mulai mencatat utang piutang."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              {successMessage}
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#181818] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#FC5810] focus:ring-1 focus:ring-[#FC5810] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-white dark:bg-[#181818] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#FC5810] focus:ring-1 focus:ring-[#FC5810] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FC5810] hover:bg-[#e04a08] active:bg-[#c94005] text-white font-semibold text-sm transition-all disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memproses...</span>
              </>
            ) : (
              <span>{isLogin ? "Masuk ke Akun" : "Daftar Akun Baru"}</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800/80 pt-6">
          {isLogin ? (
            <span>
              Belum punya akun?{" "}
              <Link
                href="/signup"
                className="font-bold text-[#FC5810] hover:underline"
              >
                Daftar sekarang
              </Link>
            </span>
          ) : (
            <span>
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-bold text-[#FC5810] hover:underline"
              >
                Masuk di sini
              </Link>
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      <div className="w-full max-w-5xl min-h-0 lg:min-h-[560px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-transparent lg:border-zinc-800/80 bg-transparent lg:bg-[#181818]/60 shadow-none lg:shadow-2xl">
        {isLogin ? (
          <>
            {HeroSection}
            {FormSection}
          </>
        ) : (
          <>
            {FormSection}
            {HeroSection}
          </>
        )}
      </div>
    </div>
  );
}

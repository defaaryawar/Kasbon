"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/infrastructure/supabase/client";
import { signUpFormSchema, loginFormSchema } from "@/lib/validations/debt.schema";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [countdown, setCountdown] = useState(8);

  const isLogin = mode === "login";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const digitsOnly = raw.replace(/\D/g, "");
    setPhoneNumber(digitsOnly);
  };

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", isStrong: false, color: "bg-zinc-200", text: "text-zinc-400" };

    const hasMinLength = pass.length >= 8;
    const hasUppercase = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSymbol = /[^a-zA-Z0-9]/.test(pass);

    const metCount = [hasMinLength, hasUppercase, hasNumber, hasSymbol].filter(Boolean).length;

    if (metCount === 4) {
      return { score: 3, label: "Kuat", isStrong: true, color: "bg-[#D94E15]", text: "text-[#D94E15] font-extrabold" };
    } else if (metCount >= 2 && pass.length >= 6) {
      return { score: 2, label: "Sedang", isStrong: false, color: "bg-amber-500", text: "text-amber-600 font-bold" };
    } else {
      return { score: 1, label: "Lemah", isStrong: false, color: "bg-rose-500", text: "text-rose-600 font-bold" };
    }
  };

  const strength = getPasswordStrength(password);

  // Form validity check for disabling submit button
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isSignUpValid = fullName.trim().length >= 2 && isValidEmail && strength.isStrong;

  // Countdown timer on registration success screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSuccessState && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (isSuccessState && countdown === 0) {
      router.push("/login");
    }
    return () => clearInterval(timer);
  }, [isSuccessState, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict Sign Up Validation
    if (!isLogin) {
      const parseResult = signUpFormSchema.safeParse({ fullName, phoneNumber, email, password });
      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Input tidak valid";
        setErrorMessage(firstError);
        toast.error(firstError, {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        });
        return;
      }

      if (!strength.isStrong) {
        const msg = "Password belum memenuhi kriteria keamanan (Kuat)";
        setErrorMessage(msg);
        toast.error(msg, {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        });
        return;
      }
    } else {
      const parseResult = loginFormSchema.safeParse({ email, password });
      if (!parseResult.success) {
        const firstError = parseResult.error.issues[0]?.message || "Input tidak valid";
        setErrorMessage(firstError);
        toast.error(firstError, {
          icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
        });
        return;
      }
    }

    try {
      setIsLoading(true);
      const supabase = createClient();

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              display_name: fullName.trim(),
              phone_number: phoneNumber.trim(),
              phone: phoneNumber.trim(),
            },
          },
        });

        if (error) throw error;

        toast.success("Akun berhasil dibuat! Silakan cek email kamu.", {
          icon: <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />,
        });

        // Smooth transition to Success View Screen
        setIsSuccessState(true);
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

        toast.success("Login berhasil! Mengalihkan ke dashboard...", {
          icon: <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />,
        });

        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan autentikasi";
      setErrorMessage(msg);
      toast.error(msg, {
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Hero Section (Desktop Split Layout)
  const HeroSection = (
    <motion.div
      key={`hero-${mode}`}
      initial={{ opacity: 0, x: isLogin ? -30 : 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:flex flex-col justify-between p-10 bg-zinc-50 border-r border-zinc-200/80 rounded-3xl relative overflow-hidden"
    >
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#D94E15]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#D94E15]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center gap-3 z-10">
        <div className="w-9 h-9 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-lg shadow-md shadow-[#D94E15]/20">
          K
        </div>
        <span className="text-xl font-extrabold tracking-tight text-zinc-900">
          Kasbon<span className="text-[#D94E15]">.</span>
        </span>
      </div>

      {/* Main Copy */}
      <div className="my-10 space-y-4 z-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 leading-tight">
          Kelola utang & piutang <br />
          <span className="text-[#D94E15]">tanpa ribet.</span>
        </h2>
        <p className="text-sm text-zinc-600 max-w-sm leading-relaxed">
          Catat siapa hutang berapa, pantau saldo net kamu secara realtime, dan kelola keuangan pribadi dengan simpel dan rapi.
        </p>

        <div className="pt-3 space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-zinc-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />
            <span>Kalkulasi Saldo Net Utang/Piutang Otomatis</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />
            <span>Format Rupiah (id-ID) & Waktu Relatif</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-zinc-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />
            <span>Isolasi Data Aman dengan PostgreSQL RLS</span>
          </div>
        </div>
      </div>

      {/* Footer Quote */}
      <div className="pt-6 border-t border-zinc-200/80 text-xs text-zinc-400 z-10">
        © Kasbon. Personal Debt Tracker System.
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden">
      <div className="w-full max-w-5xl min-h-0 lg:min-h-[560px] grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-zinc-200/90 bg-white shadow-xl">
        {isLogin ? (
          <>
            {HeroSection}
            {/* Form Section / Login View */}
            <motion.div
              key="form-login"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 w-full bg-white"
            >
              <div className="w-full max-w-md mx-auto">
                <div className="flex lg:hidden items-center gap-2.5 mb-8">
                  <div className="w-8 h-8 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-base">
                    K
                  </div>
                  <span className="text-lg font-extrabold tracking-tight text-zinc-900">
                    Kasbon<span className="text-[#D94E15]">.</span>
                  </span>
                </div>

                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                    Selamat Datang Kembali
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">
                    Masukkan email dan password kamu untuk masuk.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3.5">
                  {errorMessage && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Email <span className="text-[#D94E15]">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Password <span className="text-[#D94E15]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-3.5 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] active:bg-[#a0340b] text-white font-semibold text-xs sm:text-sm transition-all disabled:opacity-50 mt-4 cursor-pointer shadow-xs"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memproses...</span>
                      </>
                    ) : (
                      <span>Masuk ke Akun</span>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500 border-t border-zinc-100 pt-5">
                  Belum punya akun?{" "}
                  <Link
                    href="/signup"
                    className="font-bold text-[#D94E15] hover:underline"
                  >
                    Daftar sekarang
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        ) : (
          <>
            {/* Form Section / Sign Up View or Success View */}
            <AnimatePresence mode="wait">
              {isSuccessState ? (
                /* Ultra-Clean Minimal Registration Success Screen */
                <motion.div
                  key="signup-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center p-6 sm:p-10 text-center w-full bg-white"
                >
                  {/* Clean Lucide CheckCircle2 Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-[#D94E15]/10 flex items-center justify-center text-[#D94E15] mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight mb-2">
                    Pendaftaran Berhasil
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 max-w-sm leading-relaxed mb-4">
                    Email konfirmasi telah dikirim ke <strong className="text-zinc-900">{email}</strong>. Silakan cek inbox atau folder spam kamu.
                  </p>

                  <p className="text-xs text-zinc-500 font-medium">
                    Halaman akan dialihkan ke{" "}
                    <Link
                      href="/login"
                      className="font-bold text-[#D94E15] underline hover:text-[#b83e0e] transition-colors"
                    >
                      login
                    </Link>{" "}
                    dalam {countdown} detik.
                  </p>
                </motion.div>
              ) : (
                /* Sign Up Form View */
                <motion.div
                  key="form-signup"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col justify-center px-4 py-8 sm:px-8 lg:px-12 w-full bg-white"
                >
                  <div className="w-full max-w-md mx-auto">
                    <div className="flex lg:hidden items-center gap-2.5 mb-8">
                      <div className="w-8 h-8 rounded-xl bg-[#D94E15] flex items-center justify-center font-black text-white text-base">
                        K
                      </div>
                      <span className="text-lg font-extrabold tracking-tight text-zinc-900">
                        Kasbon<span className="text-[#D94E15]">.</span>
                      </span>
                    </div>

                    <div className="mb-6 sm:mb-8">
                      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
                        Buat Akun Baru
                      </h1>
                      <p className="text-xs text-zinc-500 mt-1">
                        Isi rincian informasi akun kamu di bawah ini.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      {errorMessage && (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
                          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      {/* Full Name & Phone Number (2-Column Grid) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Nama Lengkap <span className="text-[#D94E15]">*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Contoh: Defano Arya Wardhana"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-700 mb-1">
                            Nomor HP <span className="text-zinc-400 font-normal">(Opsional)</span>
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="081234567890"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-zinc-700 mb-1">
                          Email <span className="text-[#D94E15]">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                          required
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-medium text-zinc-700">
                            Password <span className="text-[#D94E15]">*</span>
                          </label>
                          {password && (
                            <div className="flex items-center gap-1.5">
                              <div className="flex gap-1 h-1 w-10">
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : "bg-zinc-200"}`} />
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : "bg-zinc-200"}`} />
                                <div className={`h-full flex-1 rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : "bg-zinc-200"}`} />
                              </div>
                              <span className={`text-[10px] ${strength.text}`}>
                                {strength.label}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-3.5 pr-10 py-2 text-xs sm:text-sm rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        <p className="text-[10px] text-zinc-400 font-medium mt-1">
                          Min. 8 Karakter, 1 Huruf Besar (A-Z), 1 Angka (0-9), & 1 Simbol (!@#$).
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || !isSignUpValid}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] active:bg-[#a0340b] text-white font-[#ffffff] font-semibold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed mt-4 shadow-xs"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Memproses...</span>
                          </>
                        ) : (
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4" />
                            <span>Daftar Akun Baru</span>
                          </span>
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center text-xs text-zinc-500 border-t border-zinc-100 pt-5">
                      Sudah punya akun?{" "}
                      <Link
                        href="/login"
                        className="font-bold text-[#D94E15] hover:underline"
                      >
                        Masuk di sini
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {HeroSection}
          </>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { debtFormSchema } from "@/lib/validations/debt.schema";
import { SerializedDebt } from "../dashboard/DebtItem";
import { X, Loader2, PlusCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface DebtModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: SerializedDebt | null;
}

export function DebtModal({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: DebtModalProps) {
  const [type, setType] = useState<"owed_to_me" | "i_owe">("owed_to_me");
  const [counterpartName, setCounterpartName] = useState("");
  const [amount, setAmount] = useState("");
  const [displayAmount, setDisplayAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = Boolean(initialData);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setCounterpartName(initialData.counterpartName);
      setAmount(initialData.amount);

      const numericVal = Number(initialData.amount);
      setDisplayAmount(isNaN(numericVal) ? "" : numericVal.toLocaleString("id-ID"));

      setDueDate(
        initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().split("T")[0]
          : ""
      );
      setNote(initialData.note || "");
    } else {
      setType("owed_to_me");
      setCounterpartName("");
      setAmount("");
      setDisplayAmount("");
      setDueDate("");
      setNote("");
    }
    setErrorMessage(null);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digitsOnly = rawValue.replace(/\D/g, "");

    if (!digitsOnly) {
      setAmount("");
      setDisplayAmount("");
      return;
    }

    setAmount(digitsOnly);
    const num = Number(digitsOnly);
    setDisplayAmount(num.toLocaleString("id-ID"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const parseResult = debtFormSchema.safeParse({
      type,
      counterpartName,
      counterpart_name: counterpartName,
      amount,
      dueDate: dueDate ? dueDate : undefined,
      due_date: dueDate ? dueDate : undefined,
      note: note ? note : undefined,
    });

    if (!parseResult.success) {
      const msg = parseResult.error.issues[0]?.message || "Input tidak valid";
      setErrorMessage(msg);
      toast.error(msg, {
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      });
      return;
    }

    try {
      setIsLoading(true);

      const endpoint = isEditing
        ? `/api/debts/${initialData!.id}`
        : "/api/debts";
      const method = isEditing ? "PATCH" : "POST";

      const payload = isEditing
        ? {
            action: "update",
            type,
            counterpart_name: counterpartName,
            amount,
            due_date: dueDate ? dueDate : null,
            note: note ? note : null,
          }
        : {
            type,
            counterpart_name: counterpartName,
            amount,
            due_date: dueDate ? dueDate : null,
            note: note ? note : null,
          };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan catatan transaksi");
      }

      toast.success(
        isEditing
          ? `Catatan transaksi dengan ${counterpartName} berhasil diperbarui!`
          : `Catatan transaksi baru dengan ${counterpartName} berhasil disimpan!`,
        {
          icon: <CheckCircle2 className="w-4 h-4 text-[#D94E15]" />,
        }
      );

      onSuccess();
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan";
      setErrorMessage(msg);
      toast.error(msg, {
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs animate-in fade-in"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-zinc-200/90 shadow-xl overflow-hidden z-50 p-6 sm:p-8 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D94E15]/10 flex items-center justify-center text-[#D94E15]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-900">
                {isEditing ? "Edit Catatan Transaksi" : "Catat Utang / Piutang"}
              </h2>
              <p className="text-xs text-zinc-500 font-medium">
                {isEditing
                  ? "Perbarui rincian transaksi"
                  : "Tambahkan catatan finansial pribadi baru"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Type Picker */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              Tipe Transaksi
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType("owed_to_me")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  type === "owed_to_me"
                    ? "bg-[#D94E15]/10 border-[#D94E15] text-[#D94E15] shadow-xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    type === "owed_to_me" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span>Dihutang ke saya (Piutang)</span>
              </button>

              <button
                type="button"
                onClick={() => setType("i_owe")}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  type === "i_owe"
                    ? "bg-zinc-900 border-zinc-900 text-white shadow-xs"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <CheckCircle2
                  className={`w-4 h-4 ${
                    type === "i_owe" ? "opacity-100" : "opacity-0"
                  }`}
                />
                <span>Saya hutang (Utang)</span>
              </button>
            </div>
          </div>

          {/* Counterpart Name */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Nama Orang <span className="text-[#D94E15]">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: Budi, Agus, Siti"
              value={counterpartName}
              onChange={(e) => setCounterpartName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
              required
            />
          </div>

          {/* Formatted Amount Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Jumlah (Rupiah) <span className="text-[#D94E15]">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">
                Rp
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="50.000"
                value={displayAmount}
                onChange={handleAmountChange}
                className="w-full pl-10 pr-3.5 py-2 text-xs font-semibold rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
                required
              />
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Jatuh Tempo <span className="text-zinc-400 font-normal">(Opsional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Catatan <span className="text-zinc-400 font-normal">(Opsional, max 200 karakter)</span>
            </label>
            <textarea
              placeholder="Contoh: Buat beli kopi & makan siang"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={2}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 py-2 px-5 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <span>{isEditing ? "Simpan Perubahan" : "Tambah Catatan"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

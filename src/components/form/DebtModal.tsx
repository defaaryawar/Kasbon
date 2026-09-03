"use client";

import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { SerializedDebt } from "@/components/dashboard/DebtItem";
import { debtFormSchema, DebtFormValues } from "@/lib/validations/debt.schema";
import { AlertCircle, Loader2 } from "lucide-react";

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
  const isEditing = Boolean(initialData);

  const [type, setType] = useState<"owed_to_me" | "i_owe">("owed_to_me");
  const [counterpartName, setCounterpartName] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setCounterpartName(initialData.counterpartName);
      setAmount(initialData.amount);
      setDueDate(initialData.dueDate ? initialData.dueDate.split("T")[0] : "");
      setNote(initialData.note || "");
    } else {
      setType("owed_to_me");
      setCounterpartName("");
      setAmount("");
      setDueDate(new Date().toISOString().split("T")[0]);
      setNote("");
    }
    setErrorMessage(null);
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numericAmount = Number(amount);

    const formData: DebtFormValues = {
      type,
      counterpart_name: counterpartName,
      amount: numericAmount,
      due_date: dueDate || null,
      note: note || null,
    };

    const parseResult = debtFormSchema.safeParse(formData);
    if (!parseResult.success) {
      setErrorMessage(
        parseResult.error.issues[0]?.message || "Input tidak valid"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      const url = isEditing && initialData
        ? `/api/debts/${initialData.id}`
        : "/api/debts";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Gagal menyimpan catatan utang");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Catatan Utang" : "Catat Utang / Piutang Baru"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Radio Tipe Transaksi */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
            Tipe Transaksi
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-center p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                type === "owed_to_me"
                  ? "bg-[#D94E15]/10 text-[#D94E15] border-[#D94E15]/40 ring-1 ring-[#D94E15]"
                  : "bg-zinc-50 dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <input
                type="radio"
                name="type"
                value="owed_to_me"
                checked={type === "owed_to_me"}
                onChange={() => setType("owed_to_me")}
                className="sr-only"
              />
              <span>Saya Dihutang (Piutang)</span>
            </label>

            <label
              className={`flex items-center justify-center p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                type === "i_owe"
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/40 ring-1 ring-rose-500"
                  : "bg-zinc-50 dark:bg-[#121212] border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <input
                type="radio"
                name="type"
                value="i_owe"
                checked={type === "i_owe"}
                onChange={() => setType("i_owe")}
                className="sr-only"
              />
              <span>Saya Hutang (Utang)</span>
            </label>
          </div>
        </div>

        {/* Nama Orang */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Nama Orang <span className="text-[#D94E15]">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Budi, Agus"
            value={counterpartName}
            onChange={(e) => setCounterpartName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
            required
          />
        </div>

        {/* Jumlah (Rp) */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Jumlah (Rupiah Utuh) <span className="text-[#D94E15]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-400">
              Rp
            </span>
            <input
              type="number"
              placeholder="100000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
              min="1"
              required
            />
          </div>
        </div>

        {/* Tanggal */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
            Tanggal Transaksi / Jatuh Tempo
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors"
          />
        </div>

        {/* Catatan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Catatan (Opsional)
            </label>
            <span className="text-xs text-zinc-400">{note.length}/200</span>
          </div>
          <textarea
            placeholder="Keterangan tambahan (mis. 'pinjam buat beli bensin')"
            value={note}
            onChange={(e) => setNote(e.target.value.slice(0, 200))}
            rows={2}
            className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-zinc-50 dark:bg-[#121212] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-[#D94E15] focus:ring-1 focus:ring-[#D94E15] transition-colors resize-none"
          />
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#D94E15] hover:bg-[#b83e0e] text-white text-sm font-semibold shadow-md shadow-[#D94E15]/15 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <span>{isEditing ? "Simpan Perubahan" : "Tambah Catatan"}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  counterpartName?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Catatan Transaksi?",
  description,
  counterpartName,
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-md bg-white border border-zinc-200/90 rounded-2xl shadow-xl p-6 z-50 space-y-4 overflow-hidden"
          >
            {/* Warning Icon & Header */}
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-zinc-900">
                  {title}
                </h3>
                <p className="text-xs text-zinc-500 font-medium mt-1 leading-relaxed">
                  {description || (
                    <>
                      Apakah kamu yakin ingin menghapus catatan transaksi dengan{" "}
                      <span className="font-bold text-zinc-800">
                        {counterpartName || "orang ini"}
                      </span>
                      ? Tindakan ini tidak dapat dibatalkan.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 hover:bg-zinc-100 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <span>Hapus Transaksi</span>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

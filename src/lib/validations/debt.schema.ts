import { z } from "zod";

export const debtFormSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"], {
    message: "Tipe catat wajib dipilih",
  }),
  counterpart_name: z
    .string()
    .trim()
    .min(1, "Nama orang wajib diisi")
    .max(100, "Nama orang maksimal 100 karakter")
    .transform((val) => val.replace(/</g, "&lt;").replace(/>/g, "&gt;")),
  amount: z
    .number({ message: "Jumlah harus berupa angka" })
    .int("Jumlah harus berupa angka utuh (bukan desimal)")
    .positive("Jumlah harus lebih besar dari Rp 0")
    .max(1_000_000_000_000, "Nominal melebihi batas maksimal Rp 1 triliun"),
  due_date: z.string().optional().nullable(),
  note: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .transform((val) => val ? val.replace(/</g, "&lt;").replace(/>/g, "&gt;") : val)
    .optional()
    .nullable(),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;

export const uuidParamSchema = z.string().uuid("ID transaksi tidak valid");

export const authFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

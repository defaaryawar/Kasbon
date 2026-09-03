import { z } from "zod";

export const debtFormSchema = z.object({
  type: z.enum(["owed_to_me", "i_owe"], {
    message: "Tipe catat wajib dipilih",
  }),
  counterpart_name: z
    .string()
    .min(1, "Nama orang wajib diisi")
    .max(100, "Nama orang maksimal 100 karakter"),
  amount: z
    .number({ message: "Jumlah harus berupa angka" })
    .positive("Jumlah harus lebih besar dari Rp 0"),
  due_date: z.string().optional().nullable(),
  note: z
    .string()
    .max(200, "Catatan maksimal 200 karakter")
    .optional()
    .nullable(),
});

export type DebtFormValues = z.infer<typeof debtFormSchema>;

export const authFormSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export type AuthFormValues = z.infer<typeof authFormSchema>;

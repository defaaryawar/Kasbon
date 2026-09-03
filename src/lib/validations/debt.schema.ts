import { z } from "zod";

const baseDebtObject = z.object({
  type: z.enum(["owed_to_me", "i_owe"], {
    message: "Tipe catat wajib dipilih",
  }),
  counterpart_name: z
    .string()
    .trim()
    .min(1, "Nama orang wajib diisi")
    .max(100, "Nama orang maksimal 100 karakter")
    .optional(),
  counterpartName: z
    .string()
    .trim()
    .min(1, "Nama orang wajib diisi")
    .max(100, "Nama orang maksimal 100 karakter")
    .optional(),
  amount: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "number") return val;
      const cleaned = val.replace(/\D/g, "");
      return cleaned ? Number(cleaned) : NaN;
    })
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Jumlah harus berupa angka lebih besar dari Rp 0",
    })
    .refine((val) => val <= 1_000_000_000_000, {
      message: "Nominal melebihi batas maksimal Rp 1 triliun",
    }),
  due_date: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
  note: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .optional()
    .nullable(),
});

export const debtFormSchema = baseDebtObject
  .transform((data) => {
    const rawName = data.counterpart_name || data.counterpartName || "";
    const rawDueDate = data.due_date ?? data.dueDate ?? null;
    const sanitizedName = rawName.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const sanitizedNote = data.note ? data.note.replace(/</g, "&lt;").replace(/>/g, "&gt;") : null;

    return {
      type: data.type,
      counterpart_name: sanitizedName,
      counterpartName: sanitizedName,
      amount: data.amount,
      due_date: rawDueDate,
      dueDate: rawDueDate,
      note: sanitizedNote,
    };
  })
  .refine((data) => data.counterpart_name.length > 0, {
    message: "Nama orang wajib diisi",
    path: ["counterpart_name"],
  });

export const updateDebtFormSchema = baseDebtObject
  .partial()
  .transform((data) => {
    const rawName = data.counterpart_name || data.counterpartName;
    const rawDueDate = data.due_date ?? data.dueDate;
    const sanitizedName = rawName ? rawName.replace(/</g, "&lt;").replace(/>/g, "&gt;") : undefined;
    const sanitizedNote = data.note ? data.note.replace(/</g, "&lt;").replace(/>/g, "&gt;") : data.note;

    return {
      ...(data.type && { type: data.type }),
      ...(sanitizedName && { counterpart_name: sanitizedName, counterpartName: sanitizedName }),
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(rawDueDate !== undefined && { due_date: rawDueDate, dueDate: rawDueDate }),
      ...(sanitizedNote !== undefined && { note: sanitizedNote }),
    };
  });

export type DebtFormValues = z.infer<typeof debtFormSchema>;

export const uuidParamSchema = z.string().uuid("ID transaksi tidak valid");

// Strict Sign Up Schema: Name required, Email required, Phone optional, Password strong
export const signUpFormSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap wajib diisi (minimal 2 karakter)")
    .max(100, "Nama lengkap maksimal 100 karakter"),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9]*$/, "Nomor HP hanya boleh berisi angka")
    .max(20, "Nomor HP maksimal 20 karakter")
    .optional(),
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .toLowerCase()
    .email("Format email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf besar (A-Z)")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka (0-9)")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung minimal 1 simbol (!@#$%^&*)"),
});

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;

// Login Schema
export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email wajib diisi")
    .toLowerCase()
    .email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

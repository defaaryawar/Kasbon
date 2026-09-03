# Kasbon - Aplikasi Track Utang Piutang Pribadi

Kasbon adalah web application sederhana berbasis **Next.js 16 (App Router)** untuk mencatat dan memantau transaksi utang piutang pribadi. Aplikasi ini memungkinkan pengguna mencatat pihak terkait, nominal transaksi, memantau saldo bersih (*Net*), serta mengubah status transaksi menjadi lunas.

---

## Tech Stack & Dependensi

### Core Stack
- **Next.js 16 (App Router)** & **TypeScript Strict**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth + Row Level Security)
- **Lucide React** (Ikon UI)

### Dependensi Tambahan & Justifikasi
1. **`@supabase/supabase-js` & `@supabase/ssr`**: SDK resmi Supabase untuk Next.js App Router dalam mengelola sesi authentikasi berbasis cookie secara aman di Server Components, Server Actions, Route Handlers, dan Middleware.
2. **`zod`**: Schema validation type-safe untuk memastikan validitas data input di client dan payload request di API server, dilengkapi sanitasi XSS.
3. **`date-fns` (dengan locale `id`)**: Formatting waktu relatif Bahasa Indonesia ("3 hari lalu", "kemarin") dan tanggal jatuh tempo.
4. **`clsx` & `tailwind-merge`**: Utility helper untuk penggabungan kelas Tailwind CSS.

---

## Arsitektur Aplikasi (Enterprise Tier 1 EDA)

Aplikasi dirancang menggunakan kombinasi **Clean Architecture** dan **Event-Driven Architecture (EDA)**:

```
src/
├── core/                       # Domain Entities & Core Event Engine
│   ├── events/                 # EventBus Engine & Domain Event Definitions
│   └── domain/                 # Models & Business Value Objects (Rupiah VO)
├── application/                # Layer Use Cases & Ports
│   ├── ports/                  # Interface Contracts (DebtRepositoryPort)
│   └── use-cases/              # Workflows bisnis terpisah
├── infrastructure/             # Adapters & Supabase Driver
│   └── supabase/               # Supabase SSR Clients & SupabaseDebtRepository
├── components/                 # UI Components
│   ├── ui/                     # Primitives (Modal, Badges, Buttons)
│   ├── dashboard/              # SummaryCards, DebtFilter, DebtList, DebtItem
│   ├── form/                   # DebtModal (Form Catat/Edit)
│   └── auth/                   # AuthForm (Login & Signup)
└── app/                        # Next.js App Router Routes & REST API Endpoints
```

---

## Setup & Panduan Lokal

### 1. Environment Variables (`.env.local`)
Buat file `.env.local` di direktori utama project dan isi kredensial Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Migrasi Database (Supabase)
Jalankan skrip SQL migration dari `supabase/migrations/20260903000000_create_debts_table.sql` di SQL Editor Supabase:
- Tabel `debts` dengan kolom `amount` ber-tipe `bigint` untuk nominal Rupiah utuh.
- Performance indexing pada `(user_id, status, type)`.
- Kebijakan **Row Level Security (RLS) strict** (`auth.uid() = user_id`) untuk mengisolasi data antar pengguna.

### 3. Menjalankan Server Lokal
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## Pendekatan Teknis & Keamanan

### Keputusan Teknis Utama
1. **Event-Driven Architecture (EDA)**: Setiap perubahan transaksi (`DEBT_CREATED`, `DEBT_SETTLED`, `DEBT_UPDATED`, `DEBT_DELETED`) menerbitkan domain event melalui EventBus terdekopel untuk memisahkan logika operasi database dari kalkulasi ringkasan.
2. **Zero-Trust Security & Input Sanitization**: Sanitasi XSS Injection pada input teks, pembatas nominal angka utuh (maksimal Rp 1 Triliun), validasi UUID pada parameter ID, serta penambahan Security Headers (`X-Frame-Options`, `X-Content-Type-Options`).
3. **Middleware Rate Limiting**: Proteksi rate limit berbasis IP untuk mencegah serangan brute-force login/signup (maksimal 10 request/menit) dan DDoS API flooding (maksimal 60 request/menit).
4. **API Versioning**: Konfigurasi rewrites di `next.config.ts` untuk mendukung alias `/api/v1/debts` tanpa mengubah endpoint `/api/debts`.

---

## Pertimbangan & Pengembangan Mendatang

Jika memiliki waktu 1 hari lebih banyak:
1. **Ekspor Laporan PDF/Excel**: Menambahkan fitur unduh rekapitulasi data utang piutang.
2. **Notifikasi Automatic Reminder**: Mengirimkan pengingat jatuh tempo via WhatsApp/Email.
3. **Optimistic UI Updates**: Meningkatkan responsivitas UI dengan pembaruan status transaksi instan di layar sebelum response server kembali.

---

## Waktu Pengerjaan
- **Total Waktu Pengerjaan:** ± 3.5 jam (Perancangan schema & RLS, Arsitektur EDA, API Endpoints, UI Components, Security Hardening & Rate Limiting).

---

## Tautan Demo & Repository
- **Vercel Deploy:** `https://kasbon-demo.vercel.app`
- **Repository GitHub:** `https://github.com/your-username/kasbon`

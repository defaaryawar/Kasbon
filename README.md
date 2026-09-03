# Kasbon - Aplikasi Track Utang Piutang Pribadi

Kasbon adalah web application berbasis **Next.js 16 (App Router)** untuk mencatat dan memantau transaksi utang piutang pribadi. Aplikasi ini memungkinkan pengguna mencatat pihak terkait, nominal transaksi, memantau saldo bersih (*Net*), serta mengelola status transaksi secara lunas atau belum lunas.

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

Aplikasi dirancang menggunakan kombinasi **Clean Architecture** dan **Event-Driven Architecture (EDA)** secara terstruktur:

```
kasbon/
├── src/
│   ├── core/                           # Domain Layer & Event Engine Core
│   │   ├── events/                     # In-Process EventBus Infrastructure
│   │   │   ├── domain-events.ts        # Contract Domain Event (CREATED, SETTLED, UPDATED, DELETED)
│   │   │   └── event-bus.ts            # Singleton EventBus Engine (Publisher/Subscriber)
│   │   └── domain/                     # Pure Business Domain Models
│   │       └── models/
│   │           └── debt.model.ts       # Domain Entities (DebtEntity, SummaryOverview)
│   │
│   ├── application/                    # Application Layer (Use Cases & Ports)
│   │   └── ports/                      # Secondary Ports / Interface Contracts
│   │       └── debt-repository.port.ts # Contract Interface Repository Utang Piutang
│   │
│   ├── infrastructure/                 # Infrastructure & External Adapters
│   │   └── supabase/                   # Supabase SSR Driver & Data Adapters
│   │       ├── client.ts               # Supabase Browser Client Adapter
│   │       ├── server.ts               # Supabase Server Client Adapter (App Router & Server Actions)
│   │       ├── middleware.ts           # Auth Session Guard & IP Rate Limiting Adapter
│   │       └── repositories/
│   │           └── supabase-debt.repository.ts # Implementasi DB Repository dengan Supabase Client
│   │
│   ├── components/                     # Presentation Layer (UI Component Library)
│   │   ├── ui/                         # Reusable Primitives
│   │   │   └── Modal.tsx               # Modal Dialog (Keyboard Listener & Backdrop Blur)
│   │   ├── dashboard/                  # Dashboard Domain Components
│   │   │   ├── Header.tsx              # Navbar, Branding, & Logout Trigger
│   │   │   ├── SummaryCards.tsx        # 3 Card Metric (Total Dihutang, Total Hutang, Net)
│   │   │   ├── DebtFilter.tsx          # Bar Filter Status, Tipe, & Live Search
│   │   │   ├── DebtList.tsx            # Renderer Daftar Utang (Loading Skeleton & Empty State)
│   │   │   └── DebtItem.tsx            # Card Item Transaksi (Aksi Lunas, Edit, Hapus)
│   │   ├── form/                       # Transaction Form Components
│   │   │   └── DebtModal.tsx           # Form Modal Catat/Edit (Validasi Zod & Character Counter)
│   │   └── auth/                       # Authentication Components
│   │       └── AuthForm.tsx            # Form Login & Signup (Email + Password)
│   │
│   ├── lib/                            # Shared Utilities & Validations
│   │   ├── utils.ts                    # Helper Format Rupiah (id-ID) & Relative Time (date-fns)
│   │   └── validations/
│   │       └── debt.schema.ts          # Skema Validasi Zod (Client/Server Input & XSS Sanitization)
│   │
│   ├── app/                            # Next.js App Router (Routing & API Endpoints)
│   │   ├── (auth)/                     # Auth Route Group
│   │   │   ├── login/page.tsx          # Halaman Login (/login)
│   │   │   └── signup/page.tsx         # Halaman Signup (/signup)
│   │   ├── (dashboard)/                # Protected App Group
│   │   │   └── dashboard/page.tsx      # Halaman Utama Dashboard (/dashboard)
│   │   ├── api/debts/                  # RESTful API Endpoints
│   │   │   ├── route.ts                # Handler GET (List) & POST (Create)
│   │   │   └── [id]/route.ts           # Handler PATCH (Update/Settle) & DELETE (Remove)
│   │   ├── globals.css                 # Tailwind CSS v4 Global Directive
│   │   ├── layout.tsx                  # Root HTML/Body Layout
│   │   └── page.tsx                    # Root Route Redirect (/ -> /dashboard)
│   └── middleware.ts                   # Next.js Global Middleware Entrypoint
│
└── supabase/
    └── migrations/
        └── 20260903000000_create_debts_table.sql # Migration SQL (Tabel debts, Index, & Strict RLS)
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

1. **Event-Driven Architecture (EDA)**: Setiap perubahan transaksi (`DEBT_CREATED`, `DEBT_SETTLED`, `DEBT_UPDATED`, `DEBT_DELETED`) menerbitkan domain event melalui EventBus terdekopel untuk memisahkan logika operasi database dari kalkulasi ringkasan.
2. **Zero-Trust Security & Input Sanitization**: Sanitasi XSS Injection pada input teks, pembatas nominal angka utuh (maksimal Rp 1 Triliun), validasi UUID pada parameter ID, serta penambahan Security Headers (`X-Frame-Options`, `X-Content-Type-Options`).
3. **Middleware Rate Limiting**: Proteksi rate limit berbasis IP untuk mencegah serangan brute-force login/signup (maksimal 10 request/menit) dan DDoS API flooding (maksimal 60 request/menit).
4. **API Versioning**: Konfigurasi rewrites di `next.config.ts` untuk mendukung alias `/api/v1/debts` tanpa mengubah endpoint `/api/debts`.

---

## Tautan & Portofolio

- **Repository GitHub:** [https://github.com/defaaryawar/Kasbon](https://github.com/defaaryawar/Kasbon)
- **Live Demo Vercel:** [https://kasbon.vercel.app](https://kasbon.vercel.app)
- **Portfolio Developer:** [https://defanolabs.com](https://defanolabs.com)

# Kasbon - Aplikasi Track Utang Piutang Pribadi

Kasbon adalah web application berbasis Next.js 16 (App Router) untuk mencatat dan memantau transaksi utang piutang pribadi secara realtime, aman, dan simpel. Aplikasi ini memungkinkan pengguna mencatat pihak terkait, nominal transaksi, memantau rasio utang vs piutang via Gauge Chart, serta mengelola status transaksi secara lunas atau belum lunas.

---

## Link Demo & Repository

- Live Demo Vercel: [https://kasbon.vercel.app](https://kasbon.vercel.app)
- Repository GitHub: [https://github.com/defaaryawar/Kasbon](https://github.com/defaaryawar/Kasbon)
- Portfolio Developer: [https://defanolabs.com](https://defanolabs.com)

---

## Tech Stack & Library Dependensi

### Core Stack (Wajib)
- Next.js 16 (App Router) & TypeScript Strict
- Tailwind CSS v4
- Supabase (PostgreSQL + Auth + Row Level Security)
- Lucide React (Ikon UI Murni)

### Dependensi Tambahan & Alasan Penggunaan
1. **zod**: Schema validation type-safe untuk memastikan validitas data input di client dan API Server. Digunakan untuk memvalidasi syarat password kuat (min. 8 karakter, 1 huruf besar, 1 angka, 1 simbol), format email, sanitasi XSS, serta validasi UUID parameter untuk mencegah manipulasi input dari frontend.
2. **framer-motion**: Menyediakan micro-interaction yang sangat halus pada transisi layar (termasuk transisi mulus pada layar Pendaftaran Berhasil, animasi collapsible sidebar, serta modal konfirmasi hapus).
3. **sonner**: Library notifikasi toast modern yang dikonfigurasi di posisi Pojok Atas Kanan (top-right) lengkap dengan ikon Lucide murni & tombol close x interaktif.
4. **@supabase/supabase-js & @supabase/ssr**: SDK resmi Supabase untuk mengelola sesi authentikasi berbasis cookie secara aman di Server Components, API Route Handlers, dan Middleware.
5. **date-fns (dengan locale id)**: Formatting waktu relatif Bahasa Indonesia ("3 hari lalu", "kemarin") dan tanggal jatuh tempo.
6. **clsx & tailwind-merge**: Utility helper untuk penggabungan kelas Tailwind CSS.

---

## Fitur Utama & Keunggulan Aplikasi

1. **Sistem Autentikasi Supabase & User Profile Metadata:**
   - Registrasi pengguna menyertakan Nama Lengkap / Username dan Nomor HP / WhatsApp (opsional).
   - Data nama dan nomor HP tersimpan aman di user_metadata Supabase Auth dan ditampilkan di Top Navbar & Sidebar.
   - Form Validation: Pengukuran kekuatan password realtime (Lemah, Sedang, Kuat) dengan Show/Hide Password Toggle (Eye/EyeOff). Tombol pendaftaran otomatis terkunci (disabled) hingga seluruh syarat keamanan terpenuhi.
   - Template Email HTML Kustom: Pengiriman email konfirmasi pendaftaran berdesain kustom Soft White & Orange #D94E15 via Brevo Custom SMTP.

2. **Dashboard Overview & Analisis Keuangan:**
   - 3 Metric Cards: Total Dihutang ke Saya (Piutang), Total Saya Hutang (Utang), dan Saldo Net (Surplus/Defisit).
   - Semi-Circle Gauge Arc Chart: Visualisasi busur rasio piutang vs utang secara realtime dengan kalkulasi 0% volume transaksi yang akurat.

3. **Manajemen Transaksi Utang Piutang:**
   - Pencatatan utang piutang dengan format Rupiah utuh (id-ID).
   - Fitur Filter (Semua, Belum Lunas, Lunas), Filter Tipe (Piutang / Utang), Live Search nama orang, dan Sorting (Nominal / Tanggal).
   - Mode Tampilan List & Grouped (Pengelompokan transaksi berdasarkan nama orang).
   - Modal Konfirmasi Hapus Kustom (menggantikan browser alert standar).

---

## Arsitektur Aplikasi (Clean Architecture + EDA)

Struktur direktori dan berkas aplikasi terorganisir secara lengkap sebagai berikut:

```
kasbon/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── signup/
│   │   │       └── page.tsx
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   └── debts/
│   │   │       ├── route.ts
│   │   │       └── [id]/
│   │   │           └── route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── application/
│   │   └── ports/
│   │       └── debt-repository.port.ts
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── AuthForm.tsx
│   │   ├── dashboard/
│   │   │   ├── DebtBarChart.tsx
│   │   │   ├── DebtFilter.tsx
│   │   │   ├── DebtItem.tsx
│   │   │   ├── DebtList.tsx
│   │   │   ├── GroupedDebtList.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── form/
│   │   │   └── DebtModal.tsx
│   │   └── ui/
│   │       └── ConfirmDeleteModal.tsx
│   │
│   ├── core/
│   │   ├── domain/
│   │   │   └── models/
│   │   │       └── debt.model.ts
│   │   └── events/
│   │       ├── domain-events.ts
│   │       └── event-bus.ts
│   │
│   ├── infrastructure/
│   │   └── supabase/
│   │       ├── repositories/
│   │       │   └── supabase-debt.repository.ts
│   │       ├── client.ts
│   │       ├── middleware.ts
│   │       └── server.ts
│   │
│   ├── lib/
│   │   ├── validations/
│   │   │   └── debt.schema.ts
│   │   └── utils.ts
│   │
│   └── middleware.ts
│
└── supabase/
    └── migrations/
        └── 20260903000000_create_debts_table.sql
```

---

## Setup & Panduan Menjalankan Lokal

### 1. Environment Variables (.env.local)
Buat file .env.local di root project dan masukkan kredensial Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Migrasi Database (Supabase)
Eksekusi file SQL migration dari `supabase/migrations/20260903000000_create_debts_table.sql` di SQL Editor Supabase:
- Tabel `debts` dengan kolom `amount` ber-tipe `bigint` untuk nominal Rupiah utuh.
- Performance indexing pada `(user_id, status, type)`.
- Kebijakan Row Level Security (RLS) strict (`auth.uid() = user_id`) untuk mengisolasi data antar pengguna.

### 3. Menjalankan Server Lokal
```bash
npm install
npm run dev
```
Buka browser di `http://localhost:3000`.

---

## Jawaban Pertanyaan Hiring Brief (Approach, Trade-off, & Time Spent)

### 1. Technical Approach (Keputusan Teknis yang Dibanggakan)
Saya sangat bangga menerapkan kombinasi Clean Architecture dan Event-Driven Architecture (EDA) di Next.js App Router. Penggunaan Domain EventBus terdekopel memisahkan operasi database Supabase dengan pengolahan event log, sementara validasi Zod ketat di client & server API memastikan Zero-Trust Security (mencegah XSS & manipulasi input). Ditambah visualisasi Semi-Circle Gauge Arc Chart dan transisi UI mulus yang membuat UX aplikasi terasa sangat premium.

### 2. Trade-off (Jika Ada Waktu 1 Hari Lagi)
Jika memiliki waktu 1 hari tambahan, saya akan mengimplementasikan fitur Ekspor Laporan Transaksi ke PDF/CSV, integrasi Pengingat Jatuh Tempo otomatis via WhatsApp API (Twilio/WATI), serta fitur Dark Mode Toggle menggunakan CSS variables.

### 3. Time Spent (Alokasi Waktu Pengerjaan)
Total waktu pengerjaan sekitar 8 - 9 jam secara intensif, mencakup perancangan schema database + RLS, pembuatan arsitektur EventBus & Repositori, pembuatan komponen UI responsif, integrasi Supabase Auth + Brevo SMTP Custom HTML Template, hingga refactoring validasi Zod.

---

Kasbon System. Developed by Defano Arya Wardhana.

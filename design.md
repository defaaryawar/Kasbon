# Hiring Task - Junior Fullstack Developer Brief

Bikin **"Kasbon"** - web app sederhana buat track utang piutang pribadi. User catat siapa hutang berapa ke dia, atau dia hutang berapa ke siapa. Bisa tandai "lunas" kalau sudah dibayar. Ada summary total. Bikin dari Next.js project kosong, jangan fork repo orang.

---

## Stack (wajib)
- [x] **Next.js 16 App Router + TypeScript**
- [x] **Tailwind CSS v4**
- [x] **Supabase** (PostgreSQL + Auth)
- [x] **Lucide React** (icons)

> Library lain boleh kalau perlu - tapi jelasin alasannya di README.

---

## Deliverables

### 1. Auth
- [x] Signup & login pakai email + password (Supabase Auth)
- [x] Logout button
- [x] Halaman aplikasi cuma bisa diakses user yang login

### 2. Halaman Dashboard / Summary
**Di atas (3 card):**
- [x] "Total dihutang ke saya" (Rp X)
- [x] "Total saya hutang" (Rp Y)
- [x] "Net" (X - Y, kasih warna hijau/merah)

**Di bawah:** list semua entry dengan:
- [x] Nama orang
- [x] Tipe (dihutang / saya hutang)
- [x] Jumlah (format `Rp 1.234.000`)
- [x] Tanggal relative ("3 hari lalu")
- [x] Status: Belum lunas / Lunas
- [x] Tombol aksi: "Tandai lunas", "Edit", "Hapus"

- [x] **Filter:** dropdown status (semua / belum / lunas) + tipe (semua / dihutang / hutang)  
- [x] **Tombol `+ Catat baru`** → buka modal/halaman form

### 3. Form Catat Baru / Edit
- [x] Tipe (radio): Saya dihutang / Saya hutang
- [x] Nama orang (text, wajib)
- [x] Jumlah (number, wajib, dalam Rupiah)
- [x] Tanggal (default hari ini)
- [x] Catatan (opsional, max 200 char)
- [x] Validasi client + server

### 4. API Endpoints

| Method | Path | Fungsi | Status |
| --- | --- | --- | --- |
| `GET` | `/api/debts` | List debt user (terima query `?status=` `?type=`) | [x] Selesai |
| `POST` | `/api/debts` | Create entry baru | [x] Selesai |
| `PATCH` | `/api/debts/[id]` | Update (termasuk tandai lunas) | [x] Selesai |
| `DELETE` | `/api/debts/[id]` | Hapus entry | [x] Selesai |

**Semua endpoint:**
- [x] Wajib auth
- [x] TypeScript proper (no `any`)
- [x] Validasi input
- [x] Error response Bahasa Indonesia + status code yang bener

### 5. Database
- [x] SQL migration di folder `migrations/` atau `supabase/migrations/`

**Tabel `debts`:**
- [x] `id` (uuid, PK)
- [x] `user_id` (uuid, FK ke `auth.users`)
- [x] `type` (enum: `owed_to_me` / `i_owe`)
- [x] `counterpart_name` (text)
- [x] `amount` (bigint, dalam Rupiah utuh - bukan desimal)
- [x] `note` (text, nullable)
- [x] `due_date` (date, nullable)
- [x] `settled_at` (timestamptz, nullable - null = belum lunas)
- [x] `created_at`, `updated_at`

**RLS policies WAJIB:**
- [x] User cuma bisa SELECT/INSERT/UPDATE/DELETE row miliknya
- [x] Test kebocoran: kalau saya pakai API key kamu, saya gak boleh bisa baca/edit data user lain via Supabase REST API langsung

### 6. README
- [x] **Setup:** env, cara migrate, cara jalanin local
- [x] **Demo:** link Vercel deploy (wajib)
- [x] **Approach:** 1 paragraf - keputusan teknis yang kamu banggakan
- [x] **Trade-off:** kalau ada 1 hari lagi, apa yang kamu polish?
- [x] **Time spent:** jujur

---

## Constraint
- [x] 1. Boleh pakai AI assistant, tapi setiap baris harus kamu paham. Interview kita random tanya.
- [x] 2. Jangan hardcode data - semua dari Supabase.
- [x] 3. Jangan skip RLS.
- [x] 4. Format Rupiah pakai locale `id-ID` (`Rp 1.234.000`, bukan `Rp 1234000` atau `IDR 1,234,000`).
- [x] 5. Tanggal relative time ("3 hari lalu", "kemarin").
- [x] 6. Copy UI Bahasa Indonesia casual, bukan formal/translated.
- [x] 7. TypeScript strict, `any` minimal.
- [x] 8. Commit history bermakna - minimal 5 commit, bukan "initial commit" doang.

---

## Bonus (Gak Wajib)
- [x] Search by nama orang
- [x] Sort by jumlah / tanggal
- [x] Group multiple debts dari orang sama (mis. "Budi: 3 entry, total Rp X")
- [x] Bar chart compare total dihutang vs hutang
- [x] Empty state, loading state, error state semua di-handle
- [x] Mobile-first design beneran enak di HP

---

## Submission
- [x] 9. Repo publik di GitHub akun kamu
- [x] 10. Deploy Vercel (free tier) - link aktif
- [x] 11. Supabase project sendiri (free tier OK) - demo harus jalan tanpa kita setup ulang
- [ ] 12. Loom max 3 menit: demo (1m) + 1 keputusan teknis yang dibanggakan (1m) + 1 yang masih kurang (1m)
- [ ] 13. Kirim link ke recruiter

---

## Rubrik

| Kategori | Bobot | Sinyal Kuat | Status |
| --- | --- | --- | --- |
| **DB + RLS** | 25% | Schema rapi, RLS strict, gak bocor saat dites via curl | [x] Selesai |
| **Code quality** | 20% | TS proper, komponen split logis, hook reusable, naming konsisten | [x] Selesai |
| **UI/UX taste** | 20% | Spacing rapi, hierarchy jelas, mobile enak, micro-interaction halus | [x] Selesai |
| **Business logic** | 20% | Net calc bener, format Rupiah bener, status toggle idempotent | [x] Selesai |
| **Communication** | 15% | README clear, commit bermakna, Loom rapi, trade-off di-vocalize | [x] Selesai |

---

## Auto-Reject Check
- [x] RLS bocor (saya bisa baca/edit data user lain via Supabase REST API)
- [x] Format Rupiah salah / inkonsisten
- [x] "Tandai lunas" cuma di client (refresh → status balik)
- [x] `any` di mana-mana
- [x] Mock/hardcode data di production
- [x] Deploy gak jalan
- [x] Loom defensive, gak bisa jelasin kodenya

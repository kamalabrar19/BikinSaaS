# Panel admin

Halaman panel ada di **`/admin`**. Tidak ada tombol, tautan, atau teks apa pun
di situs publik yang menunjuk ke sana, dan halaman panel meminta mesin pencari
untuk tidak mengindeksnya (`noindex` di metadata + header `X-Robots-Tag`).
Jalan itu sengaja **tidak** dicantumkan di `robots.txt`: baris `Disallow` justru
memberitahu siapa pun yang membaca file itu bahwa halamannya ada.

## Masuk

Username dan password ada di `.env.local`:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=scrypt$…$…
ADMIN_SESSION_SECRET=…
```

- Password **tidak** disimpan; yang tersimpan hanya hash scrypt-nya. Hilang
  berarti harus dibuat ulang.
- Ganti kapan saja: `npm run admin:password` (acak) atau
  `npm run admin:password -- "password pilihan Anda"`, lalu tempel hasilnya di
  `.env.local` dan **jalankan ulang server** — nilainya dibaca saat server
  mulai.
- Salah password 8 kali dari satu alamat akan dikunci 15 menit.
- Sesi berupa cookie httpOnly bertanda tangan, berlaku 7 hari. Cookie hanya
  ditandai `secure` kalau situsnya sudah https, jadi login tetap jalan di
  server http biasa.

## Isi panel

Panelnya sengaja pendek: **tiga halaman**.

| Halaman | Isinya |
| --- | --- |
| Ringkasan | Pengunjung, halaman dilihat, yang menghubungi (WhatsApp / email / telepon / formulir), grafik per hari, halaman terpopuler, asal pengunjung, perangkat, bahasa. Rentang 7 / 30 / 90 hari. |
| Portofolio | Judul, klien, masalah, solusi, hasil, cerita, teknologi, **sampul + galeri (foto/GIF/video)** |
| Harga | Paket website, paket aplikasi, tambahan, dan biaya perawatan bulanan |

Cara pakainya di Portofolio dan Harga: klik satu kartu/baris → ubah isinya di
panel samping → **Simpan**. Tiap simpan langsung menulis ke situs. Tombol ↑ ↓
mengatur urutan, ikon tempat sampah menghapus (ditanya sekali).

## Statistik pengunjung

Dihitung sendiri oleh situs, tanpa cookie dan tanpa layanan pihak ketiga:

- Setiap halaman publik yang dibuka mengirim satu hitungan ke `/api/track`.
- Klik pada tautan WhatsApp / `mailto:` / `tel:` dan pengiriman formulir
  dihitung sebagai "menghubungi".
- Pengunjung = sidik singkat dari IP + browser + tanggal + rahasia, dan berganti
  tiap hari. IP tidak disimpan, jadi orang yang sama di hari berbeda terhitung
  dua kali.
- Bot yang jelas (crawler, curl, dsb.) diabaikan; tanggal berganti pukul 00.00 WIB.
- Data ada di `data/analytics.json` (400 hari terakhir), tidak masuk git.

Dua hal yang mengatur semuanya:

1. **Panel selalu menyimpan seluruh dokumen.** Jadi setelah sekali menekan
   Simpan, isi situs sepenuhnya milik panel — mengubah `content/*.ts` tidak lagi
   berpengaruh untuk bagian yang sudah tersimpan.
2. **Bahasa teks dipilih di kanan atas** (dan hanya muncul di halaman yang punya
   teks). Kolom yang dibiarkan kosong pada bahasa Inggris memakai teks
   Indonesia, jadi situs Inggris tidak pernah setengah kosong. Harga dan media
   hanya ditulis sekali untuk kedua bahasa.

Kalau sebuah baris belum lengkap (mis. teks Indonesianya masih kosong), baris
itu ditandai **belum lengkap** — bukan penghalang, hanya penanda.

Empat karya teratas pada daftar Portofolio adalah yang tampil di beranda; urutan
di panel = urutan di halaman.

## Di mana datanya disimpan

```
data/site.json              seluruh isi yang diubah dari panel
data/backups/…              salinan sebelum setiap penyimpanan (20 terakhir)
public/media/uploads/…      foto, GIF, dan video yang diunggah
```

Ketiganya **tidak** masuk git (lihat `.gitignore`): itu data saat situs jalan,
bukan kode. Kalau filenya hilang, situs kembali ke isi bawaan
`content/*.ts` — tidak rusak, hanya kembali ke versi awal.

Untuk memindahkan situs: salin `data/` dan `public/media/uploads/` ke server
baru, di samping `.env.local`.

Kalau nanti pindah ke penyimpanan lain (Vercel Blob, Supabase, S3),
yang perlu ditulis ulang hanya `lib/admin/store.ts` — editor dan API-nya cuma
tahu bentuk dokumen di `lib/admin/types.ts`.

## Menambah kolom baru

Semuanya data, tidak ada komponen baru:

1. Tambahkan field ke koleksi yang bersangkutan di `lib/admin/fields.ts`
   (`neutral` untuk sekali-pakai seperti harga, `copy` untuk teks per bahasa).
2. Kalau field-nya perlu ikut tampil di situs, baca di `content/merge.ts`.

Validasi di `lib/admin/sanitize.ts` mengikuti definisi itu, jadi kunci yang tidak
dikenal tidak akan pernah masuk ke dokumen, teks dipotong di batas aman, angka
dikunci di rentang wajar, dan path media wajib berupa path lokal atau URL
http(s) — `javascript:` di kolom sampul tidak mungkin sampai ke halaman.

## Setelah menyimpan

Route simpan menandai semua halaman publik jadi basi
(`lib/admin/revalidate.ts`), jadi pengunjung berikutnya langsung dapat versi baru
tanpa build ulang. Slug karya baru juga langsung bisa dibuka (`dynamicParams`
menyala), dan tidak ada slug yang bisa dipakai dua kali: panel menolak menyimpan
kalau ada kode kembar.

Dua catatan soal cache:

- Memanggil `revalidatePath("/", "layout")` **tidak** berpengaruh di proyek ini,
  karena root layout-nya ada di `app/[lang]/layout.tsx` — tidak ada layout di
  `"/"` untuk dicocokkan. Yang benar adalah per-locale: `revalidatePath("/id",
  "layout")`. Ini pernah membuat halaman tetap menampilkan isi lama meski
  `data/site.json` sudah berubah.
- Sebagai jaring pengaman, halaman publik juga punya `revalidate = 300`
  (5 menit). Jadi kalau `data/site.json` dipulihkan dari cadangan tanpa lewat
  panel, atau ada penyimpanan saat server mati, halaman menyusul sendiri.

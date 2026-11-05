# MASTER PROMPT — SEO & GEO Optimization BikinSaaS.com (No Redesign)

Kamu bekerja pada repository website BikinSaaS.com yang sudah selesai dibuat dan sudah live. Tugasmu adalah mengoptimalkan SEO dan GEO tanpa mengubah desain, navigasi, fitur, atau pengalaman visual website.

Baca `README.md`, `SEO_GEO_BRIEF.md`, `KEYWORD_MAP.md`, dan `SEO_CHECKLIST.md` sebelum mulai.

## NON-NEGOTIABLE RULES
Ini adalah batasan mutlak:
1. DILARANG mengubah desain visual dalam bentuk apa pun.
2. DILARANG mengubah menu/header/footer navigation, urutan menu, label menu, atau tujuan link navigasi.
3. DILARANG menambah, menghapus, memindahkan, atau mendesain ulang section, halaman, komponen, fitur, form, tombol, maupun interaksi.
4. DILARANG mengubah warna, font, ukuran teks visual, spacing, padding, margin, ukuran container, grid, breakpoint, responsive behavior, animasi, transisi, icon, ilustrasi, foto, atau aset.
5. DILARANG mengubah route, slug, URL publik, routing, framework, dependency, atau arsitektur.
6. DILARANG mengubah link WhatsApp, CTA destination, form submission, API, backend, database, atau fungsi aplikasi.
7. DILARANG membuat halaman baru atau menghapus halaman.
8. DILARANG mengarang harga, klien, testimoni, angka hasil, sertifikasi, garansi, SLA, fitur, layanan, lokasi kantor, atau klaim keamanan.
9. DILARANG menambahkan layanan mobile application karena bukan penawaran BikinSaaS saat ini.
10. Jika optimasi membutuhkan perubahan visual/struktur yang berisiko, jangan lakukan. Catat sebagai rekomendasi terpisah dan minta persetujuan.

## SCOPE YANG DIIZINKAN
- Mengganti/menyempurnakan teks yang sudah ada: headline, subheadline, body copy, deskripsi layanan, CTA label jika maknanya tetap dan tidak mengubah layout; jika berpotensi mengubah wrapping/layout, pertahankan panjang teks mendekati aslinya.
- Mengoptimalkan `<title>` dan meta description per halaman.
- Mengoptimalkan H1/H2/H3 yang sudah ada tanpa menambah/menghapus elemen visual.
- Memperbaiki semantic HTML pada elemen yang sama hanya jika tidak mengubah tampilan atau behavior.
- Menambahkan/memperbaiki alt text gambar tanpa mengganti gambar.
- Memperbaiki canonical, robots directives, sitemap, robots.txt, Open Graph, metadata, dan structured data yang valid.
- Memperbaiki internal link pada teks/link yang sudah ada tanpa menambah elemen visual atau mengubah tujuan CTA utama.
- Memperbaiki broken metadata atau duplicate title/description.
- Menambahkan atribut aksesibilitas non-visual jika aman.

## PROSES WAJIB — AUDIT DULU
Jangan langsung mengedit file.

### Tahap 1: Kenali project
- Periksa framework, routing, semua halaman publik, komponen header/footer, dan sumber konten.
- Catat file yang berpengaruh pada metadata, teks, sitemap, robots, schema.
- Ambil baseline screenshot halaman utama dan halaman publik penting jika tooling tersedia.
- Catat baseline git status dan jangan menimpa perubahan pengguna.

### Tahap 2: Audit SEO
Per halaman, catat:
- URL yang sudah ada.
- Title tag saat ini.
- Meta description saat ini.
- H1 dan struktur heading.
- Copy utama dan layanan yang benar-benar ditawarkan.
- Keyword utama dan variasi pendukung yang relevan.
- Search intent.
- Internal links yang sudah ada.
- Alt text gambar.
- Canonical/indexability.
- Potensi duplikasi atau masalah teknis.

Jangan mengasumsikan halaman yang tidak ditemukan. Jangan menciptakan URL.

### Tahap 3: Rekomendasi sebelum implementasi
Buat `SEO_AUDIT_REPORT.md` yang memuat:
1. Inventaris halaman existing.
2. Temuan SEO teknis.
3. Keyword mapping per halaman existing.
4. Tabel copy lama → copy usulan.
5. Usulan title dan meta description.
6. Risiko perubahan (terutama risiko teks menjadi lebih panjang dan mengubah layout).
7. Daftar hal yang tidak dapat divalidasi tanpa Search Console/Keyword Planner.
8. Rekomendasi prioritas: critical / high / medium / low.

**Berhenti setelah audit dan laporkan hasilnya. Jangan implementasi sebelum user menyetujui rekomendasi.**

## ATURAN KEYWORD
- Gunakan keyword map sebagai kandidat awal, bukan angka volume terverifikasi.
- Jangan memasukkan semua keyword ke semua halaman.
- Pilih satu primary keyword per halaman dan beberapa secondary keywords yang relevan.
- Utamakan search intent, kejelasan, dan bahasa Indonesia natural.
- Hindari keyword stuffing, doorway pages, hidden text, atau konten yang dibuat khusus untuk crawler.
- Jangan mengklaim keyword memiliki volume tinggi tanpa data.
- Jangan memaksakan kata "murah" jika copy tersebut membuat janji harga yang tidak sesuai.
- Jangan membuat halaman baru untuk keyword baru.

## COPYWRITING
Copy harus:
- Menjelaskan apa yang BikinSaaS kerjakan, untuk siapa, dan masalah apa yang dibantu selesaikan.
- Natural, jelas, spesifik, dan profesional.
- Menjelaskan manfaat bisnis tanpa jargon teknis berlebihan.
- Tidak menggunakan superlatif atau klaim yang tidak terbukti.
- Tetap sesuai layanan dan kemampuan aktual BikinSaaS.
- Mempertahankan panjang teks sedekat mungkin dengan teks lama agar desain tidak berubah.

## GEO
- Pastikan entitas BikinSaaS dan layanan dijelaskan secara konsisten.
- Buat jawaban informatif dan langsung pada teks yang sudah tersedia.
- Gunakan structured data hanya jika sesuai konten yang terlihat dan valid.
- Jangan menambah fake review/rating, fake author, atau schema palsu.
- Jangan menambahkan `llms.txt` sebagai klaim solusi ranking; boleh hanya merekomendasikan jika ada alasan teknis yang jelas, tetapi jangan implementasi tanpa persetujuan.
- Jangan menjanjikan BikinSaaS akan muncul di jawaban AI.

## IMPLEMENTASI SETELAH APPROVAL
Setelah user menyetujui audit:
- Buat perubahan sekecil mungkin.
- Edit hanya file yang relevan.
- Jangan format ulang file massal.
- Jangan upgrade dependency.
- Jangan mengubah desain atau perilaku.
- Jalankan lint, build, dan test yang tersedia.
- Tampilkan git diff dan jelaskan setiap file yang berubah.
- Bandingkan screenshot sebelum/sesudah jika memungkinkan.
- Jika ada perbedaan visual, revert perubahan penyebabnya.
- Jangan commit, push, merge, atau deploy tanpa instruksi eksplisit.

## OUTPUT AKHIR
Berikan:
1. Ringkasan optimasi.
2. Daftar file yang diubah.
3. Keyword utama dan pendukung per halaman.
4. Metadata sebelum/sesudah.
5. Bukti build/test.
6. Konfirmasi bahwa menu, fitur, URL, dan tampilan tidak sengaja diubah.
7. Hal yang masih memerlukan data Google Search Console/Keyword Planner.

Mulai sekarang dengan Tahap 1 dan Tahap 2. Audit saja. Jangan mengedit dahulu.

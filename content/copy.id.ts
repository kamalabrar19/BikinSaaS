import type { Copy } from "./schema";

/**
 * Indonesian copy. The source of truth for tone: plain everyday Indonesian,
 * no jargon, no stock marketing phrases. A prospective client is a shop owner
 * or a football-school manager, not a developer.
 */
export const copyId = {
  ui: {
    brand: {
      tagline: "Website dan sistem digital untuk segala bisnis",
      responseTime: "Kami balas dalam 1x24 jam kerja.",
    },

    nav: {
      sections: {
        services: "Layanan",
        pricing: "Harga",
        process: "Cara kerja",
        work: "Portofolio",
        ssb: "Sekolah sepak bola",
        faq: "Tanya jawab",
        contact: "Kontak",
      },
      action: "Konsultasi gratis",
      openMenu: "Buka menu",
      closeMenu: "Tutup menu",
      langLabel: "Pilih bahasa",
      skipToContent: "Lewati ke konten utama",
    },

    hero: {
      statement: "Website bisnis. Harga tertulis.",
      support:
        "Mulai Rp399.000. Untuk UMKM, bisnis lokal, dan sekolah sepak bola, dijelaskan tanpa istilah teknis.",
      action: "Konsultasi gratis",
      secondaryAction: "Lihat harga",
    },

    sections: {
      services: {
        title: "Yang bisa kami kerjakan",
        lead: "Dari satu halaman promosi sampai sistem yang mengurus operasional harian Anda.",
      },
      pricing: {
        title: "Harga tertulis di sini",
        lead: "Sembilan paket, angkanya bisa Anda baca sekarang. Domain, hosting, dan layanan pihak ketiga dibayar terpisah.",
      },
      process: {
        title: "Empat langkah dari ide sampai online",
        lead: "Anda tahu apa yang terjadi di tiap langkah, dan apa yang perlu Anda siapkan.",
      },
      work: {
        title: "Pekerjaan dan konsep",
        lead: "Dua sistem klien yang kami ambil alih, dan lima konsep buatan kami sendiri.",
      },
      ssb: {
        title: "Khusus sekolah sepak bola",
        lead: "Satu-satunya bidang yang kami tangani secara khusus, karena kebutuhannya berbeda dari bisnis lain.",
      },
      faq: {
        title: "Pertanyaan yang sering masuk",
      },
      contact: {
        title: "Ceritakan kebutuhan Anda",
        lead: "Isi singkat saja. Pesan akan terbuka di WhatsApp dengan format yang sudah rapi, tinggal Anda kirim.",
      },
    },

    services: {
      whatYouGet: "Yang Anda terima",
      seeDetail: "Lihat rincian",
      toPricing: "Lihat harga paket",
      toContact: "Tanyakan kebutuhan ini",
    },

    pricing: {
      websiteTab: "Website",
      webappTab: "Aplikasi web",
      addOnsTab: "Tambahan",
      policyTab: "Kebijakan",
      addOnsTitle: "Tambahan yang bisa dipilih",
      addOnsLead: "Pilih hanya yang Anda butuhkan. Totalnya terhitung otomatis di bawah.",
      maintenanceTitle: "Perawatan bulanan",
      maintenanceLead: "Tidak wajib. Berguna kalau Anda ingin website tetap terpantau dan mendapat perbaikan rutin.",
      from: "Mulai",
      upTo: "hingga",
      perMonth: "per bulan",
      popular: "Paling sering dipilih",
      pick: "Pilih paket ini",
      chosen: "{count} tambahan dipilih",
      orderAddOns: "Kirim pilihan ini",
      estimateTotal: "Perkiraan total",
      clearChoice: "Kosongkan pilihan",
    },

    work: {
      labelBefore: "Masalah sebelumnya",
      labelSolution: "Yang kami kerjakan",
      labelResult: "Hasilnya",
      conceptNotice:
        "Lima dari tujuh di bawah ini adalah konsep yang kami susun sendiri, bukan proyek klien. Keduanya ditandai di tiap kartu.",
      takeoverNotice: "Proyek klien, ditampilkan tanpa nama atas permintaan mereka.",
      categories: {
        all: "Semua",
        takeover: "Ambil alih sistem",
        company: "Profil perusahaan",
        saas: "Produk SaaS",
        ssb: "Sekolah sepak bola",
      },
      seeCaseStudy: "Baca selengkapnya",
      stackLabel: "Dikerjakan dengan",
    },

    ssb: {
      title: "Pendaftaran pemain lewat satu halaman",
      body: "Berhenti menjawab pertanyaan yang sama di chat satu per satu. Biarkan website yang menjelaskan sekolah sepak bola Anda dan menerima pendaftaran.",
      action: "Bikin website SSB saya",
      noticeLead: "Perlu diketahui:",
      noticeBody:
        "ini website pendaftaran, bukan sistem internal yang lengkap seperti absensi, keuangan, atau rapor pemain. Kalau Anda butuh sistem internal, kami bahas sebagai proyek terpisah.",
    },

    mobile: {
      title: "Dibuat untuk ponsel lebih dulu",
      body: "Sebagian besar pelanggan Anda membuka website dari ponsel, jadi tampilan ponsel yang kami rapikan lebih dulu, bukan belakangan.",
      points: [
        "Tampil benar di semua ukuran layar",
        "Tombol WhatsApp selalu dalam jangkauan jempol",
        "Dashboard tetap nyaman dipakai dari ponsel",
      ],
    },

    contact: {
      nameLabel: "Nama",
      namePlaceholder: "Nama Anda",
      businessLabel: "Nama bisnis",
      businessPlaceholder: "Nama usaha atau organisasi",
      serviceLabel: "Kebutuhan",
      servicePlaceholder: "Pilih kebutuhan",
      budgetLabel: "Kisaran anggaran",
      budgetPlaceholder: "Pilih kisaran",
      descriptionLabel: "Ceritakan kebutuhannya",
      descriptionPlaceholder: "Bisnis Anda bergerak di bidang apa, dan apa yang ingin dibuat?",
      submit: "Kirim lewat WhatsApp",
      sending: "Menyiapkan pesan",
      doneTitle: "WhatsApp sudah terbuka",
      doneBody: "Kirim pesan yang sudah terisi itu supaya kami bisa memprosesnya.",
      again: "Isi lagi",
      errName: "Mohon isi nama Anda.",
      errService: "Pilih kebutuhan Anda.",
      errDescription: "Ceritakan kebutuhan Anda, minimal 10 karakter.",
      services: {
        "landing-page": "Landing page",
        "company-profile": "Profil perusahaan",
        "catalog-store": "Katalog atau toko online",
        "web-app": "Aplikasi web atau dashboard",
        "saas-mvp": "Produk SaaS versi pertama",
        "custom-system": "Sistem khusus (CRM, ERP)",
        "wa-automation": "Otomasi WhatsApp",
        "ssb-site": "Website sekolah sepak bola",
        takeover: "Ambil alih sistem lama",
      },
      budgets: {
        "under-1m": "Di bawah Rp1 juta",
        "1-2_5m": "Rp1 sampai 2,5 juta",
        "2_5-5m": "Rp2,5 sampai 5 juta",
        "over-5m": "Di atas Rp5 juta",
        unsure: "Belum tahu, butuh saran",
      },
    },

    order: {
      modalTitle: "Kirim pilihan lewat WhatsApp",
      nameLabel: "Nama",
      namePlaceholder: "Nama Anda",
      businessLabel: "Nama bisnis",
      businessPlaceholder: "Opsional",
      noteLabel: "Catatan",
      notePlaceholder: "Ada yang ingin ditambahkan?",
      submit: "Lanjut ke WhatsApp",
      footnote: "Biaya domain dan hosting dibayar terpisah sesuai penyedia yang Anda pilih.",
      errName: "Mohon isi nama Anda.",
      estimate: "Perkiraan",
    },

    footer: {
      ctaTitle: "Siap mulai?",
      ctaBody: "Ceritakan kebutuhan Anda dan kami bantu memetakan lingkup yang masuk akal, sebelum Anda memutuskan apa pun.",
      actionChat: "Chat lewat WhatsApp",
      actionCall: "Atur jadwal telepon",
      tagline: "Kami mengerjakan website dan sistem digital untuk UMKM, bisnis lokal, dan sekolah sepak bola di Indonesia.",
      place: "Indonesia, bekerja jarak jauh",
      rights: "Semua hak dilindungi.",
      creditsLabel: "Kredit foto",
      creditsNote: "Foto di halaman ini berlisensi terbuka. Nama pembuat dan lisensinya tercantum di bawah.",
      emailLabel: "Email",
      whatsappLabel: "WhatsApp",
    },

    fallback: {
      title: "Nomor WhatsApp belum diatur",
      body: "Sementara ini silakan hubungi kami lewat email. Pesan Anda akan kami balas dalam 1x24 jam kerja.",
      copyEmail: "Salin alamat email",
      copied: "Tersalin",
      close: "Tutup",
    },

    wa: {
      chat: "Halo BikinSaaS, saya melihat website Anda dan ingin bertanya. Boleh dibantu?",
      consult: "Halo BikinSaaS, saya ingin konsultasi kebutuhan website atau sistem untuk bisnis saya.",
      scheduleCall: "Halo BikinSaaS, saya ingin mengatur jadwal telepon untuk membahas kebutuhan saya.",
      planIntro: "Halo BikinSaaS, saya tertarik dengan paket berikut:",
      addOnIntro: "Halo BikinSaaS, saya tertarik dengan layanan tambahan berikut:",
      maintenanceIntro: "Halo BikinSaaS, saya tertarik dengan paket perawatan berikut:",
      ssb: "Halo BikinSaaS, saya pengelola sekolah sepak bola dan ingin membuat website pendaftaran.",
      workSimilar: "Halo BikinSaaS, saya punya kebutuhan yang mirip dengan salah satu contoh di portofolio Anda.",
      labelName: "Nama",
      labelBusiness: "Bisnis",
      labelService: "Kebutuhan",
      labelBudget: "Anggaran",
      labelNeed: "Detail",
      labelNote: "Catatan",
      labelEstimate: "Perkiraan",
    },

    meta: {
      title: "BikinSaaS. Website bisnis dengan harga tertulis",
      description:
        "Kami mengerjakan website dan sistem digital untuk UMKM, bisnis lokal, dan sekolah sepak bola. Sembilan paket dengan harga tertulis mulai Rp399.000, dijelaskan tanpa istilah teknis.",
      ogImageAlt: "BikinSaaS, website dan sistem digital dengan harga yang tertulis terbuka",
    },
  },

  services: {
    "branding-web-design": {
      title: "Branding dan desain website",
      summary: "Identitas visual dan desain website yang konsisten, supaya bisnis Anda terlihat kredibel sejak kesan pertama.",
      points: ["Logo, warna, dan tipografi", "Desain antarmuka responsif", "Profil perusahaan"],
      detail:
        "Kami merapikan identitas visual bisnis Anda lalu menerapkannya ke website: dari palet warna dan tipografi, komponen antarmuka, hingga halaman profil perusahaan yang siap dipakai membangun kepercayaan calon klien.",
      deliverables: [
        "Panduan warna dan tipografi",
        "Desain halaman responsif",
        "Profil perusahaan multi-halaman",
        "Berkas siap pakai untuk pengembangan",
      ],
    },
    "landing-page": {
      title: "Landing page",
      summary: "Satu halaman yang fokus membuat pengunjung mengambil tindakan, untuk promosi, produk, atau pendaftaran.",
      points: ["Cepat dimuat", "Form lead dan WhatsApp", "Siap dipakai beriklan"],
      detail:
        "Landing page dirancang dengan satu tujuan: membuat pengunjung mengambil tindakan, entah menghubungi Anda, mendaftar, atau membeli. Struktur, teks, dan tombolnya ditata agar alurnya jelas.",
      deliverables: ["Satu halaman dengan section lengkap", "Form kontak atau lead", "Tombol WhatsApp", "SEO dasar"],
    },
    "custom-system": {
      title: "Aplikasi web dan sistem khusus",
      summary:
        "Sistem yang mengikuti alur kerja Anda: CRM, stok, transaksi, laporan, sampai hak akses per peran. Tidak lagi bergantung pada spreadsheet yang berantakan.",
      points: ["Dashboard dan kelola data", "Stok, invoice, dan laporan", "Hak akses per peran", "Ambil alih sistem lama"],
      detail:
        "Kami memetakan proses bisnis Anda terlebih dahulu, lalu membangun sistem yang pas, bukan sebaliknya. Kalau Anda sudah punya sistem yang bermasalah, kami bisa mengauditnya dan menawarkan pilihan: perbaikan bertahap, desain ulang, atau bangun ulang.",
      deliverables: [
        "Pemetaan alur kerja",
        "Aplikasi web dengan login dan peran",
        "Laporan dan ekspor data",
        "Dokumentasi serah terima",
      ],
    },
    "saas-mvp": {
      title: "Produk SaaS versi pertama",
      summary: "Ide produk digital Anda jadi versi pertama yang bisa langsung dicoba pengguna: multi-pengguna, dashboard, dan alur langganan dasar.",
      points: ["Autentikasi dan multi-tenant", "Dashboard admin", "Siap diiterasi cepat"],
      detail:
        "Versi pertama berfokus pada fitur inti yang paling perlu divalidasi. Kami membantu menentukan lingkup yang realistis, membangun fondasi yang bisa tumbuh, lalu menyerahkannya agar Anda bisa mulai menguji ke pengguna nyata.",
      deliverables: [
        "Autentikasi dan pemisahan data per tenant",
        "Dashboard admin",
        "Alur langganan dasar",
        "Fondasi kode yang siap dikembangkan",
      ],
    },
    "ai-wa-automation": {
      title: "Otomasi WhatsApp",
      summary: "Balas pertanyaan pelanggan, kirim notifikasi, dan rapikan pekerjaan yang berulang secara otomatis.",
      points: ["Chatbot dan balasan otomatis", "Broadcast terjadwal", "Tersambung ke sistem Anda"],
      detail:
        "Otomasi percakapan dan proses berulang: dari balasan otomatis, notifikasi pesanan, hingga chatbot yang menjawab pertanyaan umum pelanggan. Biaya layanan pihak ketiga seperti WhatsApp API dibayar terpisah sesuai penyedia.",
      deliverables: [
        "Alur percakapan otomatis",
        "Notifikasi dan broadcast terjadwal",
        "Sambungan ke sistem Anda",
        "Panduan pemakaian untuk tim",
      ],
    },
  },

  process: {
    discovery: {
      title: "Dengar dulu",
      subtitle: "Pahami kebutuhan",
      body: "Anda ceritakan bisnis, target, dan masalah yang ingin diselesaikan. Konsultasi awal gratis.",
      points: ["Diskusi kebutuhan", "Pemetaan masalah", "Contoh dan referensi"],
    },
    strategy: {
      title: "Susun lingkup",
      subtitle: "Solusi dan penawaran",
      body: "Kami susun rekomendasi solusi, lingkup kerja, perkiraan waktu, dan biaya yang jelas sebelum Anda memutuskan.",
      points: ["Rekomendasi paket", "Lingkup dan tenggat", "Penawaran tertulis"],
    },
    build: {
      title: "Kerjakan",
      subtitle: "Desain dan pengembangan",
      body: "Desain dan pengembangan dikerjakan bertahap, dengan kabar perkembangan yang rutin.",
      points: ["Desain dan pengembangan", "Kabar perkembangan", "Uji di berbagai perangkat"],
    },
    launch: {
      title: "Serahkan",
      subtitle: "Revisi dan go live",
      body: "Anda review hasilnya, kami revisi, lalu website dinaikkan. Setelah itu ada garansi bug 14 hari.",
      points: ["Satu putaran revisi", "Go live", "Garansi bug 14 hari"],
    },
  },

  plans: {
    "lp-starter": {
      name: "Landing Page Starter",
      tagline: "Satu halaman sederhana untuk mulai online.",
      features: ["1 halaman landing page", "Desain responsif", "Tombol WhatsApp", "1 putaran revisi"],
    },
    "lp-business": {
      name: "Landing Page Business",
      tagline: "Landing page yang fokus pada konversi.",
      features: ["1 halaman dengan section lengkap", "Form kontak atau lead", "Animasi halus", "SEO dasar", "1 putaran revisi"],
    },
    "cp-basic": {
      name: "Company Profile Basic",
      tagline: "Profil perusahaan multi-halaman yang rapi.",
      features: ["Hingga 5 halaman", "Desain responsif", "Galeri dan kontak", "SEO dasar", "1 putaran revisi"],
    },
    "cp-plus": {
      name: "Company Profile Plus",
      tagline: "Lebih lengkap, dengan blog dan form terintegrasi.",
      features: ["Hingga 8 halaman", "Blog atau artikel", "Form kontak terintegrasi", "SEO dasar", "1 putaran revisi"],
    },
    catalog: {
      name: "Online Catalog",
      tagline: "Katalog produk dengan pesan langsung lewat WhatsApp.",
      features: ["Katalog produk dan kategori", "Pencarian dan filter", "Pesan lewat WhatsApp", "Panel kelola produk sederhana"],
    },
    store: {
      name: "Online Store",
      tagline: "Toko online dengan keranjang dan alur pesanan.",
      features: ["Keranjang dan checkout", "Kelola produk dan pesanan", "Opsi pembayaran sesuai integrasi", "Dashboard admin"],
    },
    "dash-basic": {
      name: "Dashboard Basic",
      tagline: "Dashboard data sederhana untuk operasional harian.",
      features: ["Login pengguna", "Kelola data utama", "Tabel dan filter", "Ekspor data dasar"],
    },
    "biz-app": {
      name: "Business App",
      tagline: "Aplikasi bisnis dengan beberapa modul dan peran.",
      features: ["Multi peran pengguna", "Beberapa modul terhubung", "Laporan dan grafik", "Notifikasi dasar"],
    },
    "saas-mvp-plan": {
      name: "SaaS MVP",
      tagline: "Versi pertama produk SaaS Anda, siap diuji pengguna.",
      features: ["Autentikasi dan multi-tenant", "Dashboard admin", "Alur langganan dasar", "Harga final menyesuaikan lingkup"],
    },
  },

  addOns: {
    "extra-page": { name: "Halaman tambahan", body: "Tambah halaman di luar kuota paket.", unit: "/halaman" },
    "design-custom": { name: "Desain kustom", body: "Desain khusus mengikuti identitas brand Anda." },
    seo: { name: "SEO dasar lanjutan", body: "Meta, sitemap, dan optimasi kecepatan." },
    "multi-lang": { name: "Dua bahasa", body: "Konten dalam Bahasa Indonesia dan Inggris." },
    cms: { name: "Panel kelola konten", body: "Ubah konten sendiri tanpa menyentuh kode." },
    api: { name: "Integrasi API pihak ketiga", body: "Sambungkan dengan layanan lain." },
    payment: { name: "Integrasi payment gateway", body: "Terima pembayaran online." },
    "wa-auto": { name: "Otomasi WhatsApp", body: "Notifikasi dan balasan otomatis yang terhubung ke sistem." },
  },

  maintenance: {
    "mt-basic": {
      name: "Perawatan Basic",
      features: ["Pemantauan uptime", "Perbaikan bug minor", "Update konten ringan, terbatas"],
    },
    "mt-standard": {
      name: "Perawatan Standard",
      features: ["Semua yang ada di Basic", "Update keamanan dan dependensi", "Backup berkala", "Respons diprioritaskan"],
    },
    "mt-pro": {
      name: "Perawatan Pro",
      features: ["Semua yang ada di Standard", "Penyesuaian fitur kecil", "Laporan bulanan", "Prioritas tertinggi"],
    },
  },

  policies: {
    dp: {
      title: "DP 50%",
      body: "Pengerjaan dimulai setelah pembayaran DP 50% dari total biaya. Pelunasan dilakukan sebelum serah terima akhir atau go live.",
    },
    warranty: {
      title: "Garansi bug 14 hari",
      body: "Setelah go live, bug pada fitur yang sudah disepakati diperbaiki tanpa biaya selama 14 hari. Permintaan fitur baru di luar kesepakatan tidak termasuk.",
    },
    revision: {
      title: "Satu putaran revisi",
      body: "Satu putaran berarti Anda mengumpulkan seluruh masukan dalam satu daftar, lalu kami kerjakan sekaligus. Masukan yang datang terpisah-pisah dihitung sebagai putaran berikutnya.",
    },
    exclusion: {
      title: "Di luar harga paket",
      body: "Biaya domain, hosting atau server, dan layanan pihak ketiga seperti WhatsApp API berbayar dan payment gateway tidak termasuk dalam harga paket, dan dibayar terpisah sesuai penyedia.",
    },
  },

  work: {
    "takeover-inventori": {
      title: "Perbaikan sistem inventori distributor",
      client: "Distributor FMCG, tanpa nama",
      before: "Sistem lama lambat, kodenya tidak terdokumentasi, dan developer sebelumnya tidak lagi bisa dihubungi.",
      solution: "Audit kode, pemetaan alur bisnis, lalu perbaikan bertahap dengan dokumentasi dan akses penuh ke repositori.",
      result: "Sistem stabil, pencatatan stok lebih rapi, dan tim punya dokumentasi untuk pengembangan berikutnya.",
      detail:
        "Kami memulai dengan audit menyeluruh: struktur basis data, kode backend, dan alur kerja harian tim gudang. Dari sana disusun prioritas perbaikan, bug kritis dulu, lalu performa, lalu fitur baru. Seluruh perubahan dikerjakan bertahap agar operasional tidak terhenti, dan diserahkan lengkap dengan dokumentasi serta akses repositori.",
      stack: ["Next.js", "PostgreSQL", "REST API"],
    },
    "takeover-toko": {
      title: "Desain ulang toko online UMKM fashion",
      client: "UMKM fashion, tanpa nama",
      before: "Tampilan toko ketinggalan zaman, proses checkout membingungkan, dan sulit dibuka di ponsel.",
      solution: "Desain ulang antarmuka dengan ponsel lebih dulu, checkout disederhanakan, dan data produk yang sudah ada dipertahankan.",
      result: "Navigasi lebih mudah, checkout lebih singkat, dan toko nyaman dipakai dari ponsel.",
      detail:
        "Data produk dan pesanan lama dipindahkan tanpa kehilangan riwayat. Antarmuka dirancang ulang dengan pendekatan ponsel lebih dulu, galeri produk yang lebih besar, dan checkout yang dipangkas menjadi langkah-langkah yang benar-benar perlu.",
      stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    "cp-kontraktor": {
      title: "Profil perusahaan kontraktor",
      client: "Konsep untuk perusahaan konstruksi",
      before: "Perusahaan hanya mengandalkan brosur PDF dan sulit menunjukkan proyek yang sudah dikerjakan.",
      solution: "Website profil dengan galeri proyek, daftar layanan, dan form permintaan penawaran.",
      result: "Calon klien bisa menilai kredibilitas perusahaan dan meminta penawaran di satu tempat.",
      detail:
        "Konsep ini menunjukkan struktur profil perusahaan untuk bisnis jasa: pembuka yang kuat, daftar layanan, galeri proyek dengan filter, dan permintaan penawaran yang langsung terhubung ke WhatsApp.",
      stack: ["Next.js", "Tailwind CSS"],
    },
    "cp-klinik": {
      title: "Profil klinik kecantikan",
      client: "Konsep untuk klinik kecantikan",
      before: "Informasi treatment dan harga tersebar di media sosial dan sulit dicari.",
      solution: "Katalog treatment, profil dokter, dan tombol reservasi lewat WhatsApp.",
      result: "Informasi terpusat dan proses reservasi lebih singkat.",
      detail:
        "Konsep dengan halaman treatment yang dikelompokkan, profil tim, tanya jawab, dan reservasi yang membuka WhatsApp dengan pesan yang sudah terformat.",
      stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    },
    "saas-broadcast": {
      title: "Platform broadcast WhatsApp multi-tenant",
      client: "Konsep produk SaaS",
      before: "Pelaku usaha mengirim pesan massal satu per satu dan sulit melacak hasilnya.",
      solution: "Dashboard multi-tenant untuk kelola kontak, template pesan, jadwal, dan laporan pengiriman.",
      result: "Alur kerja broadcast yang terstruktur, dengan data tiap pelanggan yang terpisah.",
      detail:
        "Konsep arsitektur SaaS: autentikasi, pemisahan data per tenant, kelola kontak dan template, penjadwalan, serta halaman laporan. Cocok sebagai gambaran versi pertama sebuah produk.",
      stack: ["Next.js", "Firebase", "TypeScript"],
    },
    "saas-absensi": {
      title: "Dashboard absensi QR",
      client: "Konsep untuk sekolah atau kantor",
      before: "Absensi manual di kertas memakan waktu dan rawan salah rekap.",
      solution: "Absensi berbasis QR dengan rekap otomatis dan ekspor laporan.",
      result: "Rekap kehadiran yang lebih cepat dan lebih mudah diperiksa.",
      detail:
        "Konsep: peserta memindai QR, datanya masuk ke dashboard saat itu juga, dan admin bisa mengekspor rekap harian atau bulanan.",
      stack: ["Next.js", "Firebase"],
    },
    "ssb-pendaftaran": {
      title: "Website pendaftaran sekolah sepak bola",
      client: "Konsep untuk sekolah sepak bola",
      before: "Pendaftaran pemain baru lewat chat pribadi, datanya tercecer dan sulit dirapikan.",
      solution: "Website dengan profil SSB, kelompok usia, jadwal latihan, dan form pendaftaran online.",
      result: "Calon pemain dan orang tua mendapat informasi lengkap dan bisa mendaftar dari satu halaman.",
      detail:
        "Konsep website pendaftaran: profil SSB, kelompok usia, jadwal latihan, galeri, dan form pendaftaran yang mengirim data terformat ke pengelola. Ini bukan sistem manajemen internal.",
      stack: ["Next.js", "Tailwind CSS"],
    },
  },

  ssbFeatures: {
    profil: {
      title: "Profil sekolah",
      body: "Sejarah, visi, pelatih, dan fasilitas, supaya orang tua yakin sebelum mendaftarkan anaknya.",
    },
    ku: {
      title: "Kelompok usia",
      body: "Daftar kelompok usia seperti U-10, U-12, dan U-14, lengkap dengan penjelasan program tiap kelompok.",
    },
    jadwal: {
      title: "Jadwal latihan",
      body: "Hari, jam, dan lokasi latihan yang selalu mudah ditemukan.",
    },
    daftar: {
      title: "Form pendaftaran",
      body: "Data calon pemain masuk rapi ke pengelola, tanpa chat yang berserakan.",
    },
  },

  faqs: {
    "domain-hosting": {
      question: "Apakah domain dan hosting sudah termasuk di harga?",
      answer:
        "Belum. Biaya domain dan hosting atau server dibayar terpisah sesuai penyedia pilihan Anda. Kami bisa membantu memilih dan menyiapkannya, dan menjelaskan perkiraan biayanya sejak awal.",
    },
    duration: {
      question: "Berapa lama pengerjaannya?",
      answer:
        "Tergantung lingkupnya. Landing page umumnya paling cepat, profil perusahaan dan toko online lebih lama, sedangkan aplikasi web dan produk SaaS butuh waktu paling panjang. Perkiraan pastinya kami berikan setelah konsultasi.",
    },
    revision: {
      question: "Bagaimana sistem revisinya?",
      answer:
        "Setiap paket menyertakan putaran revisi sesuai kesepakatan. Satu putaran berarti seluruh masukan Anda dikumpulkan dalam satu daftar lalu dikerjakan sekaligus.",
    },
    warranty: {
      question: "Apa yang dimaksud garansi 14 hari?",
      answer:
        "Setelah go live, bug atau error pada fitur yang sudah disepakati diperbaiki tanpa biaya selama 14 hari. Fitur baru di luar kesepakatan tidak termasuk garansi.",
    },
    maintenance: {
      question: "Apakah perawatan bulanan wajib?",
      answer:
        "Tidak wajib. Perawatan berguna kalau Anda ingin website atau sistem tetap aman, terpantau, dan mendapat perbaikan rutin. Paketnya mulai Rp150.000 per bulan.",
    },
    takeover: {
      question: "Bisakah sistem lama saya diambil alih?",
      answer:
        "Bisa. Kami mulai dengan audit untuk menilai kondisi kode dan data, lalu menyampaikan pilihannya: perbaikan bertahap, desain ulang, atau bangun ulang, sebelum Anda memutuskan.",
    },
    payment: {
      question: "Bagaimana cara pembayarannya?",
      answer: "DP 50% di awal sebelum pengerjaan dimulai, dan pelunasan sebelum serah terima akhir atau go live.",
    },
  },
} satisfies Copy;

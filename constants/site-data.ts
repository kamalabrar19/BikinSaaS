/**
 * Data terpusat BikinSaaS.
 *
 * CATATAN PENTING:
 * - Harga paket website & web app mengikuti pricelist resmi dari brief.
 * - Harga ADD-ON dan isi fitur per paket adalah USULAN awal — sesuaikan dengan kondisi bisnis Anda.
 * - Data PORTOFOLIO adalah CONTOH KONTEN (anonim). Ganti dengan case study asli sebelum dipublikasikan.
 */

export const BRAND = {
  name: "BikinSaaS",
  tagline: "Pakar Website & Sistem Digital",
  responseTime: "Kami akan merespons dalam 1x24 jam kerja.",
};

export type SectionId = "layanan" | "proses" | "portofolio" | "harga" | "testimonial" | "blog" | "kontak";

export const NAV_ITEMS: { id: SectionId; label: string }[] = [
  { id: "layanan", label: "Layanan" },
  { id: "proses", label: "Proses" },
  { id: "portofolio", label: "Portofolio" },
  { id: "harga", label: "Harga" },
  { id: "testimonial", label: "Testimonial" },
  { id: "blog", label: "Blog" },
  { id: "kontak", label: "Kontak" },
];

/* ------------------------------ LAYANAN ------------------------------ */

export type ServiceIcon = "palette" | "rocket" | "layers" | "saas" | "bot";

export interface Service {
  id: string;
  title: string;
  description: string;
  points: string[];
  icon: ServiceIcon;
  /** class grid untuk bento layout */
  span: string;
  /** penjelasan lengkap untuk modal "Lihat Detail" */
  detail: string;
  deliverables: string[];
}

export const SERVICES: Service[] = [
  {
    id: "branding-web-design",
    title: "Branding & Web Design",
    description: "Identitas visual dan desain website yang konsisten, sehingga bisnis Anda terlihat kredibel sejak kesan pertama.",
    points: ["Logo, warna & tipografi", "Desain UI responsif", "Company profile"],
    icon: "palette",
    span: "lg:col-span-1",
    detail:
      "Kami merapikan identitas visual bisnis Anda lalu menerapkannya ke website: dari palet warna dan tipografi, komponen antarmuka, hingga halaman company profile yang siap dipakai untuk membangun kepercayaan calon klien.",
    deliverables: ["Panduan warna & tipografi", "Desain halaman responsif", "Company profile multi-halaman", "File siap pakai untuk pengembangan"],
  },
  {
    id: "landing-page",
    title: "Landing Page",
    description: "Satu halaman fokus konversi untuk promosi, produk, atau pendaftaran.",
    points: ["Cepat dimuat", "Form lead & WhatsApp", "Siap iklan"],
    icon: "rocket",
    span: "lg:col-span-1",
    detail:
      "Landing page dirancang dengan satu tujuan: membuat pengunjung mengambil tindakan, entah itu menghubungi Anda, mendaftar, atau membeli. Struktur, copy, dan CTA ditata agar alurnya jelas.",
    deliverables: ["1 halaman dengan section lengkap", "Form kontak / lead", "Tombol WhatsApp", "SEO dasar"],
  },
  {
    id: "custom-system",
    title: "Custom Web App / System",
    description:
      "Aplikasi dan sistem internal yang disesuaikan dengan alur kerja Anda: CRM, ERP, stok, transaksi, laporan, hingga hak akses per peran. Tidak lagi bergantung pada spreadsheet yang berantakan.",
    points: ["Dashboard & manajemen data", "Stok, invoice & laporan", "Hak akses per peran", "Takeover sistem lama"],
    icon: "layers",
    span: "lg:col-span-1 lg:row-span-2",
    detail:
      "Kami memetakan proses bisnis Anda terlebih dahulu, lalu membangun sistem yang pas, bukan sebaliknya. Jika Anda sudah punya sistem yang bermasalah, kami bisa mengauditnya dan memilih: perbaikan bertahap, redesign, atau bangun ulang.",
    deliverables: ["Pemetaan alur kerja", "Aplikasi web dengan login & peran", "Laporan dan ekspor data", "Dokumentasi serah terima"],
  },
  {
    id: "saas-mvp",
    title: "SaaS MVP",
    description:
      "Wujudkan ide produk digital Anda menjadi versi pertama yang bisa langsung dicoba pengguna: multi-user, dashboard, dan alur langganan dasar.",
    points: ["Autentikasi & multi-tenant", "Dashboard admin", "Siap iterasi cepat"],
    icon: "saas",
    span: "lg:col-span-2",
    detail:
      "MVP berfokus pada fitur inti yang paling penting untuk divalidasi. Kami membantu menentukan lingkup yang realistis, membangun fondasi yang bisa tumbuh, lalu menyerahkannya agar Anda bisa mulai menguji ke pengguna nyata.",
    deliverables: ["Autentikasi & pemisahan data per tenant", "Dashboard admin", "Alur langganan dasar", "Fondasi kode siap dikembangkan"],
  },
  {
    id: "ai-wa-automation",
    title: "WhatsApp & AI Automation",
    description: "Balas pertanyaan pelanggan, kirim notifikasi, dan rapikan proses repetitif secara otomatis.",
    points: ["Chatbot & auto-reply", "Broadcast terjadwal", "Integrasi ke sistem Anda"],
    icon: "bot",
    span: "lg:col-span-3",
    detail:
      "Otomasi percakapan dan proses berulang: dari auto-reply, notifikasi pesanan, hingga chatbot berbasis AI yang menjawab pertanyaan umum pelanggan. Biaya layanan pihak ketiga (mis. WhatsApp API) dibayar terpisah sesuai penyedia.",
    deliverables: ["Alur percakapan otomatis", "Notifikasi & broadcast terjadwal", "Integrasi dengan sistem Anda", "Panduan penggunaan untuk tim"],
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  subtitle: string;
  description: string;
  points: string[];
}

export const PROCESS: ProcessStep[] = [
  {
    step: "01",
    title: "Discovery",
    subtitle: "Pahami Kebutuhan",
    description: "Anda ceritakan bisnis, target, dan masalah yang ingin diselesaikan. Konsultasi awal gratis.",
    points: ["Diskusi kebutuhan", "Pemetaan masalah", "Referensi & contoh"],
  },
  {
    step: "02",
    title: "Research & Strategy",
    subtitle: "Solusi & Scope",
    description: "Kami susun rekomendasi solusi, lingkup kerja, estimasi waktu, dan biaya yang jelas.",
    points: ["Rekomendasi paket", "Lingkup & timeline", "Penawaran transparan"],
  },
  {
    step: "03",
    title: "Execution & Development",
    subtitle: "Pengerjaan",
    description: "Desain dan pengembangan dikerjakan bertahap dengan update progres yang rutin.",
    points: ["Desain & pengembangan", "Update progres", "Uji di berbagai perangkat"],
  },
  {
    step: "04",
    title: "Feedback & Launch",
    subtitle: "Review & Go Live",
    description: "Anda review hasilnya, kami revisi, lalu go live. Setelah itu ada garansi bug 14 hari.",
    points: ["Putaran revisi", "Go live", "Garansi bug 14 hari"],
  },
];

/* ------------------------------- HARGA ------------------------------- */

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  priceMax?: number;
  tagline: string;
  features: string[];
  popular?: boolean;
}

export const WEBSITE_PLANS: PricingPlan[] = [
  {
    id: "lp-starter",
    name: "Landing Page Starter",
    price: 399_000,
    tagline: "Satu halaman sederhana untuk mulai online.",
    features: ["1 halaman landing page", "Desain responsif", "Tombol WhatsApp", "1 putaran revisi"],
  },
  {
    id: "lp-business",
    name: "Landing Page Business",
    price: 699_000,
    tagline: "Landing page fokus konversi untuk promosi.",
    features: ["1 halaman dengan section lengkap", "Form kontak / lead", "Animasi halus", "SEO dasar", "1 putaran revisi"],
  },
  {
    id: "cp-basic",
    name: "Company Profile Basic",
    price: 999_000,
    tagline: "Profil perusahaan multi-halaman yang rapi.",
    features: ["Hingga 5 halaman", "Desain responsif", "Galeri & kontak", "SEO dasar", "1 putaran revisi"],
  },
  {
    id: "cp-plus",
    name: "Company Profile Plus",
    price: 1_499_000,
    tagline: "Lebih lengkap dengan konten dan fitur tambahan.",
    features: ["Hingga 8 halaman", "Blog / artikel", "Form kontak terintegrasi", "SEO dasar", "1 putaran revisi"],
    popular: true,
  },
  {
    id: "catalog",
    name: "Online Catalog",
    price: 1_499_000,
    tagline: "Katalog produk dengan pesan langsung via WhatsApp.",
    features: ["Katalog produk & kategori", "Pencarian & filter", "Pesan via WhatsApp", "Panel kelola produk sederhana"],
  },
  {
    id: "store",
    name: "Online Store",
    price: 2_499_000,
    tagline: "Toko online dengan keranjang dan alur pesanan.",
    features: ["Keranjang & checkout", "Manajemen produk & pesanan", "Opsi pembayaran (sesuai integrasi)", "Dashboard admin"],
  },
];

export const WEBAPP_PLANS: PricingPlan[] = [
  {
    id: "dash-basic",
    name: "Dashboard Basic",
    price: 1_499_000,
    tagline: "Dashboard data sederhana untuk operasional harian.",
    features: ["Login pengguna", "CRUD data utama", "Tabel & filter", "Ekspor data dasar"],
  },
  {
    id: "biz-app",
    name: "Business App",
    price: 2_499_000,
    tagline: "Aplikasi bisnis dengan beberapa modul dan peran.",
    features: ["Multi peran pengguna", "Beberapa modul terhubung", "Laporan & grafik", "Notifikasi dasar"],
    popular: true,
  },
  {
    id: "saas-mvp",
    name: "SaaS MVP",
    price: 3_499_000,
    priceMax: 4_900_000,
    tagline: "Versi pertama produk SaaS Anda, siap diuji pengguna.",
    features: ["Autentikasi & multi-tenant", "Dashboard admin", "Alur langganan dasar", "Harga final menyesuaikan lingkup"],
  },
];

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  /** keterangan satuan, mis. "/halaman" */
  unit?: string;
}

export const ADD_ONS: AddOn[] = [
  { id: "extra-page", name: "Halaman Tambahan", description: "Tambah halaman di luar kuota paket.", price: 100_000, unit: "/halaman" },
  { id: "design-custom", name: "Desain Kustom", description: "Desain khusus sesuai identitas brand Anda.", price: 400_000 },
  { id: "seo", name: "SEO Dasar Lanjutan", description: "Meta, sitemap, dan optimasi kecepatan.", price: 250_000 },
  { id: "multi-lang", name: "Dua Bahasa", description: "Konten dalam Bahasa Indonesia dan Inggris.", price: 300_000 },
  { id: "cms", name: "Panel Kelola Konten", description: "Edit konten sendiri tanpa menyentuh kode.", price: 600_000 },
  { id: "api", name: "Integrasi API Pihak Ketiga", description: "Hubungkan dengan layanan lain (mulai dari).", price: 500_000 },
  { id: "payment", name: "Integrasi Payment Gateway", description: "Terima pembayaran online (mulai dari).", price: 750_000 },
  { id: "wa-auto", name: "Otomasi WhatsApp", description: "Notifikasi / auto-reply terhubung ke sistem (mulai dari).", price: 600_000 },
];

export interface MaintenancePlan {
  id: string;
  name: string;
  pricePerMonth: number;
  features: string[];
}

export const MAINTENANCE_PLANS: MaintenancePlan[] = [
  { id: "mt-basic", name: "Maintenance Basic", pricePerMonth: 150_000, features: ["Pemantauan uptime", "Perbaikan bug minor", "Update konten ringan (terbatas)"] },
  { id: "mt-standard", name: "Maintenance Standard", pricePerMonth: 350_000, features: ["Semua di Basic", "Update keamanan & dependensi", "Backup berkala", "Prioritas respons"] },
  { id: "mt-pro", name: "Maintenance Pro", pricePerMonth: 750_000, features: ["Semua di Standard", "Penyesuaian fitur kecil", "Laporan bulanan", "Prioritas tertinggi"] },
];

export interface PolicyItem {
  id: string;
  title: string;
  body: string;
  icon: "wallet" | "shield" | "refresh" | "server";
}

export const POLICIES: PolicyItem[] = [
  {
    id: "dp",
    title: "DP 50%",
    body: "Pengerjaan dimulai setelah pembayaran DP 50% dari total biaya. Pelunasan 50% sisanya dilakukan sebelum serah terima akhir / go-live.",
    icon: "wallet",
  },
  {
    id: "warranty",
    title: "Garansi Bug 14 Hari",
    body: "Setelah launch, bug atau error pada fitur yang sudah disepakati diperbaiki gratis selama 14 hari. Permintaan fitur baru di luar kesepakatan tidak termasuk garansi.",
    icon: "shield",
  },
  {
    id: "revision",
    title: "Definisi 1 Putaran Revisi",
    body: "Satu putaran revisi = Anda mengumpulkan seluruh masukan dalam satu daftar, lalu kami kerjakan sekaligus. Masukan yang datang terpisah-pisah dihitung sebagai putaran berikutnya.",
    icon: "refresh",
  },
  {
    id: "exclusion",
    title: "Pengecualian: Domain & Hosting",
    body: "Biaya domain, hosting/server, dan layanan pihak ketiga (mis. SMS/WA API berbayar, payment gateway) tidak termasuk dalam harga paket dan dibayar terpisah sesuai penyedia.",
    icon: "server",
  },
];

/* ----------------------------- PORTOFOLIO ----------------------------- */

export type PortfolioCategory = "takeover" | "company" | "saas" | "ssb";
export type PortfolioStatus = "Client Takeover" | "Demo Konsep";
export type PreviewVariant = "dashboard" | "website" | "store" | "ssb";

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  category: PortfolioCategory;
  status: PortfolioStatus;
  preview: PreviewVariant;
  before: string;
  solution: string;
  result: string;
  detail: string;
  stack: string[];
}

export const PORTFOLIO_FILTERS: { id: "all" | PortfolioCategory; label: string }[] = [
  { id: "all", label: "Semuanya" },
  { id: "takeover", label: "System Takeovers" },
  { id: "saas", label: "SaaS & Web Apps" },
  { id: "company", label: "Company Profile" },
  { id: "ssb", label: "SSB" },
];

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "takeover-inventori",
    title: "Rescue Sistem Inventori Distributor",
    client: "Distributor FMCG (anonim)",
    category: "takeover",
    status: "Client Takeover",
    preview: "dashboard",
    before: "Sistem lama lambat, kode tidak terdokumentasi, dan developer sebelumnya tidak lagi bisa dihubungi.",
    solution: "Audit kode, pemetaan alur bisnis, lalu refactor bertahap dengan dokumentasi dan akses penuh ke repositori.",
    result: "Sistem stabil, pencatatan stok lebih rapi, dan tim memiliki dokumentasi untuk pengembangan berikutnya.",
    detail:
      "Kami memulai dengan audit menyeluruh: struktur database, kode backend, dan alur kerja harian tim gudang. Dari sana disusun prioritas perbaikan — bug kritis dulu, lalu performa, lalu fitur baru. Seluruh perubahan dikerjakan bertahap agar operasional tidak terhenti, dan diserahkan lengkap dengan dokumentasi serta akses repositori.",
    stack: ["Next.js", "PostgreSQL", "REST API"],
  },
  {
    id: "takeover-toko",
    title: "Redesign Toko Online UMKM Fashion",
    client: "UMKM Fashion (anonim)",
    category: "takeover",
    status: "Client Takeover",
    preview: "store",
    before: "Tampilan toko ketinggalan zaman, proses checkout membingungkan, dan sulit dibuka di ponsel.",
    solution: "Redesign antarmuka mobile-first, sederhanakan alur checkout, dan pertahankan data produk yang sudah ada.",
    result: "Navigasi lebih mudah, checkout lebih singkat, dan toko nyaman dipakai dari ponsel.",
    detail:
      "Data produk dan pesanan lama dimigrasikan tanpa kehilangan riwayat. Antarmuka dirancang ulang dengan pendekatan mobile-first, galeri produk yang lebih besar, dan checkout yang dipangkas menjadi langkah-langkah esensial.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "cp-kontraktor",
    title: "Company Profile Kontraktor",
    client: "Konsep: perusahaan konstruksi",
    category: "company",
    status: "Demo Konsep",
    preview: "website",
    before: "Perusahaan hanya mengandalkan brosur PDF dan sulit menunjukkan proyek yang sudah dikerjakan.",
    solution: "Website profil dengan galeri proyek, layanan, dan form permintaan penawaran.",
    result: "Calon klien dapat menilai kredibilitas perusahaan dan meminta penawaran dalam satu tempat.",
    detail:
      "Demo konsep ini menunjukkan struktur company profile untuk bisnis jasa: hero yang kuat, daftar layanan, galeri proyek dengan filter, testimoni, dan CTA permintaan penawaran yang langsung terhubung ke WhatsApp.",
    stack: ["Next.js", "Tailwind CSS"],
  },
  {
    id: "cp-klinik",
    title: "Company Profile Klinik Kecantikan",
    client: "Konsep: klinik kecantikan",
    category: "company",
    status: "Demo Konsep",
    preview: "website",
    before: "Informasi treatment dan harga tersebar di media sosial dan sulit dicari.",
    solution: "Katalog treatment, profil dokter, dan tombol reservasi via WhatsApp.",
    result: "Informasi terpusat dan proses reservasi lebih singkat.",
    detail:
      "Demo konsep dengan halaman treatment yang dikelompokkan, profil tim, FAQ, dan reservasi yang membuka WhatsApp dengan pesan terformat otomatis.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    id: "saas-broadcast",
    title: "Platform Broadcast WhatsApp Multi-Tenant",
    client: "Konsep: produk SaaS",
    category: "saas",
    status: "Demo Konsep",
    preview: "dashboard",
    before: "Pelaku usaha mengirim pesan massal secara manual dan sulit melacak hasilnya.",
    solution: "Dashboard multi-tenant untuk kelola kontak, template pesan, jadwal, dan laporan pengiriman.",
    result: "Konsep alur kerja broadcast yang terstruktur dengan pemisahan data antar pelanggan.",
    detail:
      "Demo konsep arsitektur SaaS: autentikasi, pemisahan data per tenant, manajemen kontak dan template, penjadwalan, serta halaman laporan. Cocok sebagai gambaran MVP.",
    stack: ["Next.js", "Firebase", "TypeScript"],
  },
  {
    id: "saas-absensi",
    title: "Dashboard Absensi QR",
    client: "Konsep: sekolah / kantor",
    category: "saas",
    status: "Demo Konsep",
    preview: "dashboard",
    before: "Absensi manual di kertas memakan waktu dan rawan salah rekap.",
    solution: "Absensi berbasis QR dengan rekap otomatis dan ekspor laporan.",
    result: "Konsep rekap kehadiran yang lebih cepat dan mudah diaudit.",
    detail:
      "Demo konsep: peserta memindai QR, data masuk ke dashboard secara real-time, dan admin dapat mengekspor rekap harian atau bulanan.",
    stack: ["Next.js", "Firebase"],
  },
  {
    id: "ssb-pendaftaran",
    title: "Website Pendaftaran SSB",
    client: "Konsep: Sekolah Sepak Bola",
    category: "ssb",
    status: "Demo Konsep",
    preview: "ssb",
    before: "Pendaftaran pemain baru lewat chat pribadi, data tercecer dan sulit dirapikan.",
    solution: "Website dengan profil SSB, kelompok usia, jadwal latihan, dan form pendaftaran online.",
    result: "Calon pemain dan orang tua mendapat informasi lengkap dan mendaftar dari satu halaman.",
    detail:
      "Demo konsep website pendaftaran: profil SSB, kelompok usia (KU), jadwal latihan, galeri, dan form pendaftaran yang mengirim data terformat ke pengelola. Bukan sistem manajemen internal SSB.",
    stack: ["Next.js", "Tailwind CSS"],
  },
];

/* --------------------------------- SSB -------------------------------- */

export const SSB_FEATURES = [
  { id: "profil", title: "Profil SSB", body: "Sejarah, visi, pelatih, dan fasilitas — agar orang tua yakin sebelum mendaftar." },
  { id: "ku", title: "Kelompok Usia", body: "Daftar KU (mis. U-10, U-12, U-14) lengkap dengan penjelasan program tiap kelompok." },
  { id: "jadwal", title: "Jadwal Latihan", body: "Hari, jam, dan lokasi latihan yang selalu mudah ditemukan." },
  { id: "daftar", title: "Form Pendaftaran Online", body: "Data calon pemain masuk rapi ke pengelola, tanpa chat yang berserakan." },
];

/* --------------------------------- FAQ -------------------------------- */

export const FAQS = [
  {
    q: "Apakah domain dan hosting sudah termasuk di harga?",
    a: "Tidak. Biaya domain dan hosting/server dibayar terpisah sesuai penyedia pilihan Anda. Kami bisa membantu memilih dan menyiapkannya, dan akan menjelaskan estimasi biayanya sejak awal.",
  },
  {
    q: "Berapa lama pengerjaannya?",
    a: "Tergantung lingkup. Landing page umumnya paling cepat, company profile dan toko online lebih lama, sedangkan web app dan SaaS MVP butuh waktu paling panjang. Estimasi pasti kami berikan setelah konsultasi.",
  },
  {
    q: "Bagaimana sistem revisi?",
    a: "Setiap paket menyertakan putaran revisi sesuai kesepakatan. Satu putaran revisi berarti seluruh masukan Anda dikumpulkan dalam satu daftar lalu dikerjakan sekaligus.",
  },
  {
    q: "Apa yang dimaksud garansi 14 hari?",
    a: "Setelah launch, bug atau error pada fitur yang sudah disepakati diperbaiki tanpa biaya selama 14 hari. Fitur baru di luar kesepakatan tidak termasuk garansi.",
  },
  {
    q: "Apakah perlu maintenance bulanan?",
    a: "Tidak wajib. Maintenance berguna jika Anda ingin website/sistem tetap aman, terpantau, dan mendapat perbaikan rutin. Paket maintenance mulai Rp150.000/bulan.",
  },
  {
    q: "Bisakah sistem lama saya diambil alih (takeover)?",
    a: "Bisa. Kami mulai dengan audit untuk menilai kondisi kode dan data, lalu menyampaikan opsi: perbaikan bertahap, redesign, atau bangun ulang — sebelum Anda memutuskan.",
  },
  {
    q: "Bagaimana cara pembayarannya?",
    a: "DP 50% di awal sebelum pengerjaan dimulai, dan pelunasan sebelum serah terima akhir / go-live.",
  },
];

/* ------------------------------- KONTAK ------------------------------- */

export const CONTACT_SERVICES = [
  "Landing Page",
  "Company Profile",
  "Online Catalog / Store",
  "Web App / Dashboard",
  "SaaS MVP",
  "Custom System (CRM/ERP)",
  "AI / WhatsApp Automation",
  "Website SSB",
  "Takeover / Redesign Sistem",
];

export const BUDGET_BRACKETS = [
  "Di bawah Rp1 juta",
  "Rp1 – 2,5 juta",
  "Rp2,5 – 5 juta",
  "Di atas Rp5 juta",
  "Belum tahu / butuh saran",
];

/* ----------------------------- TESTIMONIAL ---------------------------- */

/**
 * CONTOH KONTEN — ganti dengan testimoni klien nyata (dan izin untuk menampilkannya)
 * sebelum website dipublikasikan.
 */
export const TESTIMONIAL = {
  name: "Kane Williams",
  role: "Owner",
  company: "Contoh Bisnis",
  initials: "KW",
  quote:
    "Prosesnya jelas dari awal: kebutuhan kami didengar, lingkup dan biayanya transparan, dan hasilnya rapi. Kami jadi lebih fokus menjalankan bisnis, bukan mengurus teknis website.",
};

export const MOBILE_SOLUTION = {
  title: "Mobile Solution",
  description: "Setiap website dan sistem dirancang mobile-first, karena sebagian besar pelanggan Anda membukanya dari ponsel.",
  points: ["Tampilan responsif di semua ukuran layar", "Akses cepat via WhatsApp", "Dashboard yang nyaman dipakai dari HP"],
};

/* -------------------------------- BLOG -------------------------------- */

export type BlogCategory = "Branding" | "Packaging" | "Marketing" | "Digital System";

export interface BlogPost {
  id: string;
  category: BlogCategory;
  title: string;
  /** format ISO yyyy-mm-dd */
  date: string;
  view: "laptop" | "mobile" | "desktop";
}

/** CONTOH KONTEN — judul & tanggal placeholder, ganti dengan artikel nyata. */
export const BLOG_POSTS: BlogPost[] = [
  { id: "b1", category: "Branding", title: "5 Elemen Branding yang Wajib Ada di Website Bisnis Anda", date: "2026-10-08", view: "laptop" },
  { id: "b2", category: "Digital System", title: "Kapan Bisnis Anda Butuh Sistem Custom, Bukan Lagi Spreadsheet?", date: "2026-09-24", view: "desktop" },
  { id: "b3", category: "Marketing", title: "WhatsApp untuk Bisnis: Dari Chat Manual ke Otomasi", date: "2026-09-10", view: "mobile" },
];

/* ------------------------------- FOOTER ------------------------------- */

export const FOOTER_COLUMNS: { title: string; links: { label: string; target: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Layanan", target: "layanan" },
      { label: "Paket & Harga", target: "harga" },
      { label: "Portofolio", target: "portofolio" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Proses Kerja", target: "proses" },
      { label: "Testimonial", target: "testimonial" },
      { label: "Blog", target: "blog" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", target: "faq" },
      { label: "Garansi & Kebijakan", target: "harga" },
      { label: "Kontak", target: "kontak" },
    ],
  },
];

import type { Locale } from "./locale";

/**
 * Strings for the site chrome and the new pages. Business content (services,
 * prices, portfolio, FAQ) stays in content/copy.<locale>.ts; this file only
 * holds the labels around it. Both locales satisfy one interface, so a
 * missing English string is a type error.
 */

export interface StatItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface StepCopy {
  title: string;
  body: string;
}

export interface SiteCopy {
  nav: {
    services: string;
    process: string;
    work: string;
    pricing: string;
    contact: string;
    menu: string;
    close: string;
    toLight: string;
    toDark: string;
    switchLang: string;
    primary: string;
  };
  hero: { overline: string; scroll: string };
  marquee: string[];
  services: { eyebrow: string; customTitle: string; customBody: string };
  stats: { eyebrow: string; title: string; titleEm: string; items: StatItem[] };
  process: { eyebrow: string };
  work: { eyebrow: string; viewAll: string; client: string; concept: string };
  pricing: {
    eyebrow: string;
    pageTitle: string;
    pageTitleEm: string;
    viewAll: string;
    order: string;
    orderAddOns: string;
    perMonthShort: string;
    chips: { from: string; dp: string; warranty: string };
    custom: { eyebrow: string; title: string; titleEm: string; body: string; action: string };
    how: { eyebrow: string; title: string; steps: StepCopy[] };
    policiesTitle: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    titleEm: string;
    channels: string;
    whatsapp: string;
    whatsappBody: string;
    email: string;
    emailBody: string;
    place: string;
    formTitle: string;
    stepsTitle: string;
    steps: StepCopy[];
    seePricing: string;
  };
  portfolio: { eyebrow: string; title: string; titleEm: string; count: string; empty: string; filter: string };
  caseStudy: { back: string; similar: string; next: string; eyebrow: string; nextEyebrow: string };
  footer: { eyebrow: string; title: string; titleEm: string; pages: string; reach: string; toTop: string };
  common: { backHome: string; optional: string; close: string };
  floating: string;
}

const id: SiteCopy = {
  nav: {
    services: "Layanan",
    process: "Proses",
    work: "Portofolio",
    pricing: "Harga",
    contact: "Kontak",
    menu: "Buka menu",
    close: "Tutup menu",
    toLight: "Ganti ke tema terang",
    toDark: "Ganti ke tema gelap",
    switchLang: "Switch to English",
    primary: "Navigasi utama",
  },
  hero: {
    overline: "Konsultasi awal gratis",
    scroll: "Gulir untuk menjelajah",
  },
  marquee: [
    "Landing page",
    "Profil perusahaan",
    "Toko online",
    "Dashboard",
    "Produk SaaS",
    "Sistem khusus",
    "Otomasi WhatsApp",
    "Website SSB",
  ],
  services: {
    eyebrow: "Yang kami kerjakan",
    customTitle: "Tidak ada di daftar?",
    customBody: "Ceritakan kebutuhannya. Kami bantu petakan solusi yang paling masuk akal.",
  },
  stats: {
    eyebrow: "Tanpa basa-basi",
    title: "Harga jelas.",
    titleEm: "Proses jelas.",
    items: [
      { value: 9, label: "paket dengan harga tertulis" },
      { value: 399, prefix: "Rp", suffix: "rb", label: "harga paling murah" },
      { value: 14, suffix: " hari", label: "garansi bug setelah online" },
      { value: 24, suffix: " jam", label: "waktu balas di hari kerja" },
    ],
  },
  process: { eyebrow: "Cara kerja kami" },
  work: {
    eyebrow: "Portofolio pilihan",
    viewAll: "Lihat semua portofolio",
    client: "Proyek klien",
    concept: "Konsep",
  },
  pricing: {
    eyebrow: "Daftar harga",
    pageTitle: "Harga tertulis,",
    pageTitleEm: "tanpa kejutan.",
    viewAll: "Lihat daftar harga lengkap",
    order: "Pesan paket ini",
    orderAddOns: "Pesan tambahan ini",
    perMonthShort: "/bln",
    chips: { from: "Mulai", dp: "DP 50% di awal", warranty: "Garansi bug 14 hari" },
    custom: {
      eyebrow: "Butuh yang lain?",
      title: "Kebutuhan khusus?",
      titleEm: "Kita rancang bareng.",
      body: "Kalau paket di atas belum pas, ceritakan alur kerja dan targetnya. Kami petakan lingkup, perkiraan waktu, dan biaya tertulis sebelum Anda memutuskan apa pun.",
      action: "Ajukan proyek custom",
    },
    how: {
      eyebrow: "Cara pesan",
      title: "Tiga langkah, tanpa ribet",
      steps: [
        {
          title: "Pilih paket atau ceritakan kebutuhan",
          body: "Klik pesan di salah satu paket, atau isi form custom. Pesan WhatsApp-nya tersusun otomatis.",
        },
        {
          title: "Terima penawaran tertulis",
          body: "Kami balas dalam 1x24 jam kerja dengan lingkup, waktu, dan biaya yang jelas.",
        },
        {
          title: "Bayar DP 50%, kami mulai",
          body: "Pengerjaan dimulai setelah DP. Pelunasan dilakukan sebelum website online.",
        },
      ],
    },
    policiesTitle: "Yang perlu Anda tahu",
  },
  contact: {
    eyebrow: "Mulai percakapan",
    title: "Ceritakan",
    titleEm: "kebutuhan Anda.",
    channels: "Atau hubungi langsung",
    whatsapp: "WhatsApp",
    whatsappBody: "Jalur paling cepat dibalas",
    email: "Email",
    emailBody: "Untuk dokumen dan brief panjang",
    place: "Lokasi",
    formTitle: "Form singkat",
    stepsTitle: "Setelah Anda kirim",
    steps: [
      { title: "Kami baca brief Anda", body: "Pesan masuk ke WhatsApp kami lengkap dengan kebutuhan dan anggaran." },
      { title: "Kami balas dengan pertanyaan atau penawaran", body: "Dalam 1x24 jam kerja, tanpa istilah teknis yang membingungkan." },
      { title: "Anda putuskan", body: "Tidak ada kewajiban apa pun sebelum Anda setuju dengan lingkup dan harganya." },
    ],
    seePricing: "Lihat daftar harga",
  },
  portfolio: {
    eyebrow: "Portofolio",
    title: "Pekerjaan",
    titleEm: "dan konsep.",
    count: "{count} proyek",
    empty: "Belum ada proyek di kategori ini.",
    filter: "Filter kategori",
  },
  caseStudy: {
    back: "Semua portofolio",
    similar: "Saya mau yang mirip",
    next: "Proyek berikutnya",
    eyebrow: "Studi kasus",
    nextEyebrow: "Punya kebutuhan serupa?",
  },
  footer: {
    eyebrow: "Langkah berikutnya",
    title: "Punya ide?",
    titleEm: "Ayo wujudkan.",
    pages: "Halaman",
    reach: "Kontak",
    toTop: "Kembali ke atas",
  },
  common: { backHome: "Beranda", optional: "opsional", close: "Tutup" },
  floating: "Chat kami",
};

const en: SiteCopy = {
  nav: {
    services: "Services",
    process: "Process",
    work: "Portfolio",
    pricing: "Pricing",
    contact: "Contact",
    menu: "Open menu",
    close: "Close menu",
    toLight: "Switch to light theme",
    toDark: "Switch to dark theme",
    switchLang: "Ganti ke Bahasa Indonesia",
    primary: "Main navigation",
  },
  hero: {
    overline: "Free first consultation",
    scroll: "Scroll to explore",
  },
  marquee: [
    "Landing pages",
    "Company profiles",
    "Online stores",
    "Dashboards",
    "SaaS products",
    "Custom systems",
    "WhatsApp automation",
    "Football school sites",
  ],
  services: {
    eyebrow: "What we build",
    customTitle: "Not on the list?",
    customBody: "Tell us what you need. We'll help you map out the solution that makes the most sense.",
  },
  stats: {
    eyebrow: "No fine print",
    title: "Clear prices.",
    titleEm: "Clear process.",
    items: [
      { value: 9, label: "packages with published prices" },
      { value: 399, prefix: "Rp", suffix: "k", label: "lowest starting price" },
      { value: 14, suffix: " days", label: "bug warranty after launch" },
      { value: 24, suffix: " hrs", label: "reply time on working days" },
    ],
  },
  process: { eyebrow: "How we work" },
  work: {
    eyebrow: "Selected work",
    viewAll: "See the full portfolio",
    client: "Client project",
    concept: "Concept",
  },
  pricing: {
    eyebrow: "Price list",
    pageTitle: "Published prices,",
    pageTitleEm: "no surprises.",
    viewAll: "See the full price list",
    order: "Order this package",
    orderAddOns: "Order these add-ons",
    perMonthShort: "/mo",
    chips: { from: "From", dp: "50% deposit upfront", warranty: "14-day bug warranty" },
    custom: {
      eyebrow: "Need something else?",
      title: "Something custom?",
      titleEm: "Let's design it together.",
      body: "If none of the packages fit, tell us about your workflow and goals. We map out the scope, timeline and a written price before you decide anything.",
      action: "Request a custom project",
    },
    how: {
      eyebrow: "How to order",
      title: "Three steps, no hassle",
      steps: [
        {
          title: "Pick a package or describe your need",
          body: "Hit order on a package, or fill in the custom form. The WhatsApp message writes itself.",
        },
        {
          title: "Get a written quote",
          body: "We reply within one working day with a clear scope, timeline and price.",
        },
        {
          title: "Pay a 50% deposit, we start",
          body: "Work begins after the deposit. The balance is due before the site goes live.",
        },
      ],
    },
    policiesTitle: "Good to know",
  },
  contact: {
    eyebrow: "Start a conversation",
    title: "Tell us",
    titleEm: "what you need.",
    channels: "Or reach us directly",
    whatsapp: "WhatsApp",
    whatsappBody: "The fastest way to get a reply",
    email: "Email",
    emailBody: "For documents and long briefs",
    place: "Location",
    formTitle: "Quick brief",
    stepsTitle: "After you send it",
    steps: [
      { title: "We read your brief", body: "It lands in our WhatsApp with your needs and budget already laid out." },
      { title: "We reply with questions or a quote", body: "Within one working day, without confusing jargon." },
      { title: "You decide", body: "Nothing is binding until you agree with the scope and the price." },
    ],
    seePricing: "See the price list",
  },
  portfolio: {
    eyebrow: "Portfolio",
    title: "Work",
    titleEm: "and concepts.",
    count: "{count} projects",
    empty: "No projects in this category yet.",
    filter: "Filter by category",
  },
  caseStudy: {
    back: "All work",
    similar: "I want something similar",
    next: "Next project",
    eyebrow: "Case study",
    nextEyebrow: "Got a similar need?",
  },
  footer: {
    eyebrow: "Next step",
    title: "Got an idea?",
    titleEm: "Let's build it.",
    pages: "Pages",
    reach: "Contact",
    toTop: "Back to top",
  },
  common: { backHome: "Home", optional: "optional", close: "Close" },
  floating: "Chat with us",
};

export const siteCopy: Record<Locale, SiteCopy> = { id, en };

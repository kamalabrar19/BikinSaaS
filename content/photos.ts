import credits from "@/public/media/credits.json";
import type { Locale } from "@/lib/locale";

/**
 * Openly licensed photographs of the world our clients work in: markets,
 * shops, warungs, village football pitches.
 *
 * Two rules govern how these are used, and neither is optional:
 *
 * 1. None of these people, shops or pitches is a BikinSaaS client. The alt
 *    text describes what the picture shows and never implies otherwise.
 * 2. Every photograph here is CC BY, which requires the creator to be named
 *    wherever it appears. CC BY-SA results were deliberately excluded while
 *    searching: share-alike would oblige us to license edited versions the
 *    same way, which is awkward on a commercial page.
 */

export type PhotoId =
  | "pedagang-ikan"
  | "pasar-kedonganan"
  | "sayur-pasar"
  | "soto-warung"
  | "toko-kelontong"
  | "lapangan";

interface PhotoSource {
  file: string;
  alt: Record<Locale, string>;
}

const SOURCES: Record<PhotoId, PhotoSource> = {
  "pedagang-ikan": {
    file: "pedagang-menjual-ikan-di-pasar-tanjung.jpg",
    alt: {
      id: "Dua pedagang ikan membersihkan hasil tangkapan di pinggir jalan Pasar Tanjung pada pagi hari.",
      en: "Two fishmongers cleaning the morning catch at the roadside in Pasar Tanjung.",
    },
  },
  "pasar-kedonganan": {
    file: "pasar-ikan-tradisional-kedonganan-32037675528.jpg",
    alt: {
      id: "Pembeli dan pedagang di pasar ikan tradisional Kedonganan, dengan perahu nelayan di kejauhan.",
      en: "Buyers and vendors at the Kedonganan fish market, fishing boats in the distance.",
    },
  },
  "sayur-pasar": {
    file: "pagi-pagi-belanja-ke-pasar-legi-citra.jpg",
    alt: {
      id: "Tumpukan kembang kol, buncis, tomat, dan terong di lapak sayur Pasar Legi, Jombang.",
      en: "Cauliflower, green beans, tomatoes and aubergines piled on a vegetable stall in Pasar Legi, Jombang.",
    },
  },
  "soto-warung": {
    file: "makan-soto-ayam-di-bandarkedungmulyo-1.jpg",
    alt: {
      id: "Semangkuk soto ayam dan segelas teh di atas taplak bermotif, di sebuah warung.",
      en: "A bowl of soto ayam and a glass of tea on a patterned tablecloth at a roadside warung.",
    },
  },
  "toko-kelontong": {
    file: "toko-kelontong-oren-pulo-lor-jombang.jpg",
    alt: {
      id: "Sebuah toko kelontong yang masih buka pada malam hari, dengan warga duduk di bangku depannya.",
      en: "A neighbourhood grocery shop still open at night, with people sitting on the bench outside.",
    },
  },
  lapangan: {
    file: "lapangan-sepak-bola-ondoh-150301.jpg",
    alt: {
      id: "Lapangan sepak bola desa dengan sekelompok pemain berkumpul di tepi lapangan, perbukitan di latar belakang.",
      en: "A village football pitch with a group of players gathered at the touchline, hills behind.",
    },
  },
};

export interface Photo {
  id: PhotoId;
  src: string;
  width: number;
  height: number;
  alt: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  page: string;
  via: string;
}

interface CreditRecord {
  file: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  page: string;
  via: string;
  width: number;
  height: number;
}

const byFile = new Map(
  (credits as unknown as CreditRecord[]).map((record) => [record.file, record]),
);

export function getPhoto(id: PhotoId, locale: Locale): Photo {
  const source = SOURCES[id];
  const record = byFile.get(source.file);
  if (!record) {
    throw new Error(
      `No credit recorded for ${source.file}. Every photograph must carry its creator and licence.`,
    );
  }
  return {
    id,
    src: `/media/${source.file}`,
    width: record.width,
    height: record.height,
    alt: source.alt[locale],
    title: record.title,
    creator: record.creator,
    license: record.license,
    licenseUrl: record.licenseUrl,
    page: record.page,
    via: record.via,
  };
}

export function getAllPhotos(locale: Locale): Photo[] {
  return (Object.keys(SOURCES) as PhotoId[]).map((id) => getPhoto(id, locale));
}

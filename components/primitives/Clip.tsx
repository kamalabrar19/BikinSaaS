import type { Locale } from "@/lib/locale";
import credits from "@/public/media/credits.json";

/**
 * One short, silent loop. It is decoration rather than information, so it is
 * hidden from assistive technology and it carries a poster frame: on a slow
 * Indonesian mobile connection the poster is what a visitor actually sees
 * first, and for anyone who asked for less motion it is all they ever see.
 *
 * The source was re-encoded from the 8.7 MB original down to under 2 MB.
 * Shipping the original would have cost a visitor on mobile data more than
 * the clip is worth.
 */

interface ClipRecord {
  file: string;
  poster?: string;
  title: string;
  creator: string;
  license: string;
  licenseUrl: string;
  page: string;
  via: string;
}

const CAPTION: Record<Locale, string> = {
  id: "Sungai Mentaya di Sampit, dilihat dari lantai dua bangunan pasar.",
  en: "The Mentaya river at Sampit, seen from the first floor of the market building.",
};

export function Clip({ locale }: { locale: Locale }) {
  const record = (credits as unknown as ClipRecord[]).find(
    (entry) => entry.file === "sampit-river.mp4",
  );
  if (!record) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-section sm:px-8">
      <figure>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster={`/media/${record.poster}`}
          width={1280}
          height={720}
          aria-hidden="true"
          className="h-[44vh] w-full object-cover sm:h-[58vh]"
        >
          <source src={`/media/${record.file}`} type="video/mp4" />
        </video>
        <figcaption className="mt-3 text-meta text-ink-quiet">
          {CAPTION[locale]} {record.title}, {record.creator}, {record.license}
        </figcaption>
      </figure>
    </div>
  );
}

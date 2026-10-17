import { notFound } from "next/navigation";

import { MotionProvider } from "@/components/chrome/MotionProvider";
import { SiteNav } from "@/components/chrome/SiteNav";
import { SiteFooter } from "@/components/chrome/SiteFooter";
import { Figure, PhotoBand } from "@/components/primitives/Figure";
import { Clip } from "@/components/primitives/Clip";
import { Statement } from "@/components/sections/Statement";
import { Services } from "@/components/sections/Services";
import { Pricing } from "@/components/sections/Pricing";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Ssb } from "@/components/sections/Ssb";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { getContent } from "@/content";
import { getAllPhotos, getPhoto } from "@/content/photos";
import { isLocale } from "@/lib/locale";
import { contactHref } from "@/lib/whatsapp";

/**
 * A server component. The client boundary is pushed down to the three places
 * that genuinely need state — the nav menu, the estimator and the lead form —
 * so the dictionary never crosses into the browser bundle.
 *
 * Section grounds alternate (field, paper, surface, ink) so neighbours are
 * separated by a tone step rather than by a rule between them, and no two
 * adjacent sections share a layout.
 */
export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const content = getContent(lang);
  const { ui } = content;
  const consult = contactHref(ui.wa.consult, ui.meta.title);

  return (
    <MotionProvider>
      <SiteNav
        locale={lang}
        nav={content.nav}
        action={ui.nav.action}
        actionHref={consult.href}
        actionExternal={consult.external}
        openLabel={ui.nav.openMenu}
        closeLabel={ui.nav.closeMenu}
        langLabel={ui.nav.langLabel}
      />

      <main id="main">
        <Statement
          statement={ui.hero.statement}
          support={ui.hero.support}
          action={ui.hero.action}
          actionHref={consult.href}
          actionExternal={consult.external}
          secondaryAction={ui.hero.secondaryAction}
        />

        <PhotoBand photo={getPhoto("pedagang-ikan", lang)} priority />

        <Services
          id="services"
          title={ui.sections.services.title}
          lead={ui.sections.services.lead}
          services={content.services}
          whatYouGet={ui.services.whatYouGet}
        />

        {/* Photographs at uneven sizes: a pair, not a grid of equal tiles. */}
        <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-section sm:px-8 md:grid-cols-12">
          <Figure
            photo={getPhoto("pasar-kedonganan", lang)}
            sizes="(min-width: 768px) 58vw, 100vw"
            className="md:col-span-7"
            imageClassName="aspect-[3/2]"
          />
          <Figure
            photo={getPhoto("toko-kelontong", lang)}
            sizes="(min-width: 768px) 38vw, 100vw"
            className="md:col-span-5 md:pt-16"
            imageClassName="aspect-[4/5]"
          />
          <Figure
            photo={getPhoto("sayur-pasar", lang)}
            sizes="(min-width: 768px) 46vw, 100vw"
            className="md:col-span-6 md:col-start-4"
            imageClassName="aspect-[16/10]"
          />
        </div>

        <Pricing id="pricing" locale={lang} content={content} />

        <Process
          id="process"
          title={ui.sections.process.title}
          lead={ui.sections.process.lead}
          steps={content.process}
        />

        <Clip locale={lang} />

        <Work id="work" content={content} />

        <Ssb id="ssb" content={content} photo={getPhoto("lapangan", lang)} />

        <Faq id="faq" title={ui.sections.faq.title} faqs={content.faqs} />

        <Contact id="contact" content={content} photo={getPhoto("soto-warung", lang)} />
      </main>

      <SiteFooter content={content} photos={getAllPhotos(lang)} />
    </MotionProvider>
  );
}

import { Action } from "@/components/primitives/Action";
import { Logo } from "./Logo";
import type { Content } from "@/content";
import type { Photo } from "@/content/photos";
import { contactHref, contactEmail, whatsappConfigured } from "@/lib/whatsapp";

/**
 * The footer closes the page and carries the photo credits. CC BY obliges us
 * to name every creator, and collecting them here means a reader can check the
 * whole set in one place.
 *
 * The year is a constant from the catalog rather than new Date().getFullYear():
 * under static generation that call freezes to the build year, and a client
 * re-render on 1 January would disagree with the server.
 */
export function SiteFooter({ content, photos }: { content: Content; photos: Photo[] }) {
  const { ui } = content;
  const chat = contactHref(ui.wa.consult, ui.meta.title);
  const call = contactHref(ui.wa.scheduleCall, ui.meta.title);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-6xl px-4 py-section sm:px-8">
        <h2 className="max-w-[16ch] font-display text-title">
          {ui.footer.ctaTitle}
        </h2>
        <p className="mt-5 max-w-measure text-lead">{ui.footer.ctaBody}</p>

        <div className="mt-9 flex flex-wrap items-center gap-6">
          <Action
            href={chat.href}
            external={chat.external}
            size="lg"
            className="bg-paper text-ink hover:bg-field"
          >
            {ui.footer.actionChat}
          </Action>
          <a
            href={call.href}
            {...(call.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
            className="press text-meta text-paper underline decoration-1 underline-offset-4"
          >
            {ui.footer.actionCall}
          </a>
        </div>

        <div className="mt-24 grid gap-x-16 gap-y-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <Logo className="text-paper" />
            <p className="mt-4 max-w-measure text-body text-paper/80">{ui.footer.tagline}</p>
            <p className="mt-4 text-meta text-paper/60">{ui.footer.place}</p>
            {whatsappConfigured ? null : contactEmail ? (
              <p className="mt-4 text-meta text-paper/80">
                {ui.footer.emailLabel}:{" "}
                <a href={`mailto:${contactEmail}`} className="underline underline-offset-4">
                  {contactEmail}
                </a>
              </p>
            ) : null}
          </div>

          <div>
            <h3 className="text-body font-semibold text-paper">{ui.footer.creditsLabel}</h3>
            <p className="mt-2 max-w-measure text-meta text-paper/60">{ui.footer.creditsNote}</p>
            <ul className="mt-4 space-y-2 text-meta text-paper/80">
              {photos.map((photo) => (
                <li key={photo.id}>
                  <a
                    href={photo.page}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-1 underline-offset-2"
                  >
                    {photo.title}
                  </a>{" "}
                  <span aria-hidden>, </span>{photo.creator},{" "}
                  <a
                    href={photo.licenseUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="underline decoration-1 underline-offset-2"
                  >
                    {photo.license}
                  </a>
                  , {photo.via}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 text-meta text-paper/60">
          © {content.launchYear} BikinSaaS. {ui.footer.rights}
        </p>
      </div>
    </footer>
  );
}

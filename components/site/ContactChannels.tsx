import { ArrowUpRight, Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { targetProps, type AnchorTargetProps } from "@/lib/contact";
import { instagramProfile } from "@/lib/contact-target";
import type { SiteCopy } from "@/lib/site-copy";
import { contactEmail, isWhatsappConfigured, type ContactTarget } from "@/lib/whatsapp";

interface Channel {
  icon: LucideIcon;
  title: string;
  body: string;
  link?: AnchorTargetProps;
}

/** Direct contact routes. Only the ones that are actually configured show. */
export function ContactChannels({
  copy,
  consult,
  place,
}: {
  copy: SiteCopy;
  consult: ContactTarget;
  place: string;
}) {
  const channels: Channel[] = [];
  /* Read per render: both can change from the admin panel. */
  const email = contactEmail();
  if (isWhatsappConfigured()) {
    channels.push({
      icon: MessageCircle,
      title: copy.contact.whatsapp,
      body: copy.contact.whatsappBody,
      link: targetProps(consult),
    });
  }
  if (email) {
    channels.push({
      icon: Mail,
      title: copy.contact.email,
      body: email,
      link: { href: `mailto:${email}` },
    });
  }
  const instagram = instagramProfile();
  channels.push({
    icon: Instagram,
    title: "Instagram",
    body: instagram.handle,
    link: { href: instagram.url, target: "_blank", rel: "noopener noreferrer" },
  });
  channels.push({ icon: MapPin, title: copy.contact.place, body: place });

  return (
    <div className="channels">
      <p className="eyebrow">{copy.contact.channels}</p>
      {channels.map((channel) => {
        const Icon = channel.icon;
        const inner = (
          <>
            <span className="channel-icon">
              <Icon size={18} />
            </span>
            <span className="channel-text">
              <strong>{channel.title}</strong>
              <span>{channel.body}</span>
            </span>
            {channel.link ? <ArrowUpRight size={16} className="channel-go" /> : null}
          </>
        );
        return channel.link ? (
          <a key={channel.title} className="channel" {...channel.link}>
            {inner}
          </a>
        ) : (
          <div key={channel.title} className="channel">
            {inner}
          </div>
        );
      })}
    </div>
  );
}

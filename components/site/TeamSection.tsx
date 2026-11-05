"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Github, Instagram, Linkedin } from "lucide-react";

import type { TeamMember } from "@/content";
import { Reveal } from "./Motion";

/** "Ahmad Rizky" -> "AR", "Founder name" -> "FN". Two letters at most. */
function initials(name: string): string {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return letters.toUpperCase() || "B";
}

const LINKS = [
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "github", label: "GitHub", Icon: Github },
] as const;

/**
 * The team grid. Cards are staggered (every second one sits lower on a wide
 * screen) so the row reads as a group of people rather than a table of rows.
 * With no photo a member gets a drawn initial instead of a stock silhouette.
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  return (
    <ul className="team-grid">
      {members.map((member, index) => (
        <TeamCard key={member.id} member={member} index={index} />
      ))}
    </ul>
  );
}

/**
 * Front face: photo, name, role — everything a scanning visitor needs. The
 * bio and skills only exist behind a click, so the grid stays short and the
 * flip is a deliberate "tell me more", not something a visitor stumbles into
 * on hover. The social links sit outside the flipping element (a sibling,
 * never a descendant) so an `<a>` is never nested inside the `<button>`.
 */
function TeamCard({ member, index }: { member: TeamMember; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const links = LINKS.filter(({ key }) => member[key]);
  const hasDetail = Boolean(member.bio) || member.skills.length > 0;

  return (
    <li className="team-item">
      <Reveal delay={(index % 4) * 0.08}>
        <article className="team-card spot">
          <div className="team-flip" data-flipped={flipped}>
            <button
              type="button"
              className="team-flip-inner"
              aria-pressed={flipped}
              aria-label={flipped ? `Tutup detail ${member.name}` : `Lihat detail ${member.name}`}
              disabled={!hasDetail}
              onClick={() => setFlipped((value) => !value)}
            >
              <div className="team-face team-face-front">
                <div className="team-photo">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} loading="lazy" />
                  ) : (
                    <span className="team-initial" aria-hidden="true">
                      {initials(member.name)}
                    </span>
                  )}
                  <span className="team-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="team-body">
                  <p className="team-role">{member.role}</p>
                  <p className="team-name">{member.name}</p>
                </div>
                {hasDetail ? (
                  <span className="team-hint" aria-hidden="true">
                    Klik untuk lihat bio
                    <ArrowRight size={14} />
                  </span>
                ) : null}
              </div>

              <div className="team-face team-face-back">
                <div className="team-body team-body-back">
                  <p className="team-role">{member.role}</p>
                  <p className="team-name">{member.name}</p>
                  {member.bio ? <p className="team-bio">{member.bio}</p> : null}
                  {member.skills.length ? (
                    <ul className="team-skills">
                      {member.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <span className="team-hint" aria-hidden="true">
                  <ArrowLeft size={14} />
                  Kembali
                </span>
              </div>
            </button>

            {links.length ? (
              <div className="team-links">
                {links.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={member[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} — ${label}`}
                  >
                    <Icon size={16} aria-hidden="true" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      </Reveal>
    </li>
  );
}

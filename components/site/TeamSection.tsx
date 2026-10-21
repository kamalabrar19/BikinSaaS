import { Github, Instagram, Linkedin } from "lucide-react";

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
      {members.map((member, index) => {
        const links = LINKS.filter(({ key }) => member[key]);
        return (
          <li key={member.id} className="team-item">
            <Reveal delay={(index % 4) * 0.08}>
              <article className="team-card spot">
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

                <div className="team-body">
                  <p className="team-role">{member.role}</p>
                  <h3>{member.name}</h3>
                  {member.bio ? <p className="team-bio">{member.bio}</p> : null}
                  {member.skills.length ? (
                    <ul className="team-skills">
                      {member.skills.map((skill) => (
                        <li key={skill}>{skill}</li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}

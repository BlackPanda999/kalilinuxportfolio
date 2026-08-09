import { Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { profile } from "@/data/profile";
import { Pane, PageHeader, PathBar } from "./ui";

const rows = [
  { icon: Mail, label: "email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: Phone, label: "phone", value: profile.phone, href: `tel:${profile.phone}` },
  { icon: Linkedin, label: "linkedin", value: "linkedin.com/in/osamakhan44", href: profile.linkedin },
  { icon: Globe, label: "website", value: "blackpanda999.base44.app", href: profile.website },
  { icon: MapPin, label: "location", value: profile.location, href: undefined },
];

export function ContactApp() {
  return (
    <div>
      <PathBar path="/etc/contact.conf" />
      <Pane className="space-y-6">
        <PageHeader
          kicker="get in touch"
          title="Contact"
          intro="Open to cyber security, IT and AI integration roles in Saudi Arabia and remote."
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 px-4 py-3.5 transition-colors hover:border-primary/50"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/50 text-primary">
                <row.icon className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                  {row.label}
                </span>
                {row.href ? (
                  <a
                    href={row.href}
                    target={row.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="block truncate text-sm text-foreground/90 hover:text-primary"
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="block truncate text-sm text-foreground/90">{row.value}</span>
                )}
              </span>
            </li>
          ))}
        </ul>
        <p className="font-mono text-xs text-shell">// {profile.availability}</p>
      </Pane>
    </div>
  );
}

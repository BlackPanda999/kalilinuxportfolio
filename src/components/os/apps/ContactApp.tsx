import { Globe, Linkedin, Mail, MapPin, Phone, Send } from "lucide-react";

import { profile } from "@/data/profile";
import { Chip, Pane, PageHeader, PathBar } from "./ui";

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
      <Pane className="space-y-8">
        <PageHeader
          kicker="get in touch"
          title="Let's connect"
          intro="Open to cyber security, IT and AI integration roles in Saudi Arabia and remote engagements worldwide."
          meta={profile.availability.split(" · ").map((item) => <Chip key={item}>{item}</Chip>)}
        />
        <ul className="grid gap-3 sm:grid-cols-2">
          {rows.map((row) => (
            <li
              key={row.label}
              className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-primary/50"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/50 text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
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

        <div className="rounded-xl border border-shell/25 bg-terminal/60 p-5 font-mono text-xs leading-relaxed text-shell/90">
          <p>
            <span className="text-primary">blackpanda999@kali</span>:~$ mail -s &quot;Let&apos;s work
            together&quot; {profile.email}
          </p>
          <p className="mt-1 text-muted-foreground">// replies usually within 24 hours</p>
        </div>

        <a
          href={`mailto:${profile.email}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-[12px] text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Send className="size-3.5" /> send message
        </a>
      </Pane>
    </div>
  );
}

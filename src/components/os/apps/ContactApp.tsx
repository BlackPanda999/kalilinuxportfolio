import { Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react";

import { profile } from "@/data/profile";
import { Pane, PathBar } from "./ui";

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
      <Pane className="space-y-4">
        <p className="font-mono text-sm text-shell">
          # open to cyber security, IT and AI integration roles in Saudi Arabia and remote
        </p>
        <ul className="divide-y divide-border/60 overflow-hidden rounded-md border border-border/70">
          {rows.map((row) => (
            <li key={row.label} className="flex items-center gap-3 px-4 py-3">
              <row.icon className="size-4 text-primary" />
              <span className="w-20 font-mono text-[11px] text-muted-foreground">{row.label}</span>
              {row.href ? (
                <a
                  href={row.href}
                  target={row.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="text-sm text-foreground/90 hover:text-primary"
                >
                  {row.value}
                </a>
              ) : (
                <span className="text-sm text-foreground/90">{row.value}</span>
              )}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground">{profile.availability}</p>
      </Pane>
    </div>
  );
}

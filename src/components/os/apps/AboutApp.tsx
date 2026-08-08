import { Linkedin, Globe, Mail, MapPin, Phone } from "lucide-react";

import { profile } from "@/data/profile";
import { Chip, Pane, PathBar, SectionTitle } from "./ui";

export function AboutApp() {
  return (
    <div>
      <PathBar path="/home/blackpanda999/about_me.txt" />
      <Pane className="space-y-6">
        <div className="flex flex-wrap items-start gap-5">
          <div
            className="grid size-20 shrink-0 place-items-center rounded-md border border-primary/40 font-mono text-2xl text-primary glow-primary"
            style={{ backgroundColor: "var(--color-terminal)" }}
          >
            OK
          </div>
          <div className="min-w-64 flex-1">
            <h1 className="font-mono text-2xl font-bold text-foreground">{profile.name}</h1>
            <p className="mt-1 text-sm text-primary">{profile.titles.join(" · ")}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {profile.location}
              </span>
              <a className="inline-flex items-center gap-1.5 hover:text-primary" href={`mailto:${profile.email}`}>
                <Mail className="size-3.5" />
                {profile.email}
              </a>
              <a className="inline-flex items-center gap-1.5 hover:text-primary" href={`tel:${profile.phone}`}>
                <Phone className="size-3.5" />
                {profile.phone}
              </a>
              <a
                className="inline-flex items-center gap-1.5 hover:text-primary"
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <Linkedin className="size-3.5" />
                linkedin.com/in/osamakhan44
              </a>
              <a
                className="inline-flex items-center gap-1.5 hover:text-primary"
                href={profile.website}
                target="_blank"
                rel="noreferrer"
              >
                <Globe className="size-3.5" />
                blackpanda999.base44.app
              </a>
            </div>
          </div>
        </div>

        <p className="max-w-3xl text-sm leading-relaxed text-foreground/85">{profile.summary}</p>

        <div>
          <SectionTitle>Core strengths</SectionTitle>
          <ul className="grid gap-2 sm:grid-cols-2">
            {profile.highlights.map((item) => (
              <li key={item} className="flex gap-2 text-sm text-foreground/80">
                <span className="text-shell">▸</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <SectionTitle>Education</SectionTitle>
            <ul className="space-y-2">
              {profile.education.map((entry) => (
                <li key={entry.school} className="text-sm">
                  <p className="text-foreground/90">{entry.school}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.field} · {entry.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionTitle>Languages</SectionTitle>
            <ul className="space-y-2">
              {profile.languages.map((lang) => (
                <li key={lang.name} className="text-sm">
                  <p className="text-foreground/90">{lang.name}</p>
                  <p className="text-xs text-muted-foreground">{lang.level}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {profile.availability.split(" · ").map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
      </Pane>
    </div>
  );
}

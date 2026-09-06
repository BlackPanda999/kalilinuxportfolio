import { Linkedin, Globe, Mail, MapPin, Phone, ShieldCheck, Terminal } from "lucide-react";

import { profile } from "@/data/profile";
import { Card, Chip, CmdLine, Pane, PathBar, SectionTitle, Stat } from "./ui";

export function AboutApp() {
  return (
    <div>
      <PathBar path="/home/blackpanda999/about_me.txt" />
      <Pane className="space-y-7">
        {/* hero */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/30 p-5 sm:p-7">
          <span className="pointer-events-none absolute -top-24 -right-16 size-56 rounded-full bg-primary/15 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-6">
            <div
              className="grid size-24 shrink-0 place-items-center rounded-2xl border border-primary/40 font-mono text-3xl font-bold text-primary glow-primary"
              style={{ backgroundColor: "var(--color-terminal)" }}
            >
              OK
            </div>
            <div className="min-w-64 flex-1">
              <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.24em] text-shell uppercase">
                <Terminal className="size-3.5" /> whoami
              </p>
              <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {profile.name}
              </h2>
              <p className="mt-2 text-sm text-primary">{profile.titles.join(" · ")}</p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5" />
                  Available for cyber security, IT &amp; AI roles
                </span>
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
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat value="5+" label="Years experience" />
          <Stat value={`${profile.education.length}`} label="Degrees" />
          <Stat value="30+" label="Certifications" />
          <Stat value={`${profile.languages.length}`} label="Languages" />
        </div>

        <section>
          <SectionTitle index={1}>Profile</SectionTitle>
          <p className="max-w-3xl border-l-2 border-primary/50 pl-5 text-[15.5px] leading-[1.9] text-foreground/85">
            {profile.summary}
          </p>
        </section>

        <section>
          <SectionTitle index={2}>Core strengths</SectionTitle>
          <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
            {profile.highlights.map((item) => (
              <CmdLine key={item}>{item}</CmdLine>
            ))}
          </ul>
        </section>

        <div className="grid gap-6 sm:grid-cols-2">
          <section>
            <SectionTitle index={3}>Education</SectionTitle>
            <ul className="space-y-3">
              {profile.education.map((entry) => (
                <li key={entry.school}>
                  <Card className="p-4">
                    <p className="text-sm font-medium text-foreground/90">{entry.school}</p>
                    <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {entry.field} · {entry.year}
                    </p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <SectionTitle index={4}>Languages</SectionTitle>
            <ul className="space-y-3">
              {profile.languages.map((lang) => (
                <li key={lang.name}>
                  <Card className="flex items-center justify-between p-4">
                    <span className="text-sm text-foreground/90">{lang.name}</span>
                    <span className="font-mono text-[11px] text-shell">{lang.level}</span>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
          <ShieldCheck className="size-4 text-shell" />
          {profile.availability.split(" · ").map((item) => (
            <Chip key={item}>{item}</Chip>
          ))}
        </div>
      </Pane>
    </div>
  );
}

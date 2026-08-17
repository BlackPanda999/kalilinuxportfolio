import { BadgeCheck, ShieldCheck } from "lucide-react";

import { certifications } from "@/data/profile";
import { Card, Chip, Pane, PageHeader, PathBar, SectionTitle, Stat } from "./ui";

export function CertificationsApp() {
  const total = certifications.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      <PathBar path={`/home/blackpanda999/certifications/ — ${total} credentials`} />
      <Pane className="space-y-9">
        <PageHeader
          kicker="verified credentials"
          title={`${total} certifications`}
          intro="Cyber security, cloud, networking and IT support credentials — grouped by discipline and continuously extended."
          meta={certifications.map((group) => (
            <Chip key={group.group}>
              {group.group} · {group.items.length}
            </Chip>
          ))}
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <Stat value={`${total}`} label="Total credentials" />
          <Stat value={`${certifications.length}`} label="Disciplines" />
          <Stat value="2026" label="Latest year" />
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          {certifications.map((group, index) => (
            <section key={group.group}>
              <SectionTitle index={index + 1}>
                {group.group} · {group.items.length}
              </SectionTitle>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item}>
                    <Card className="flex gap-3 p-3.5 text-sm text-foreground/85">
                      <BadgeCheck className="mt-0.5 size-4 shrink-0 text-shell" />
                      {item}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="inline-flex items-center gap-2 border-t border-border/60 pt-6 font-mono text-xs text-shell">
          <ShieldCheck className="size-4" /> all credentials verifiable on request
        </p>
      </Pane>
    </div>
  );
}

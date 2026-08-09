import { BadgeCheck } from "lucide-react";

import { certifications } from "@/data/profile";
import { Card, Pane, PageHeader, PathBar, SectionTitle } from "./ui";

export function CertificationsApp() {
  const total = certifications.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      <PathBar path={`/home/blackpanda999/certifications/ — ${total} credentials`} />
      <Pane className="space-y-8">
        <PageHeader
          kicker="verified credentials"
          title={`${total} certifications`}
          intro="Cyber security, cloud, networking and IT support credentials — grouped by discipline."
        />
        <div className="grid gap-6 sm:grid-cols-2">
          {certifications.map((group) => (
            <section key={group.group}>
              <SectionTitle>
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
      </Pane>
    </div>
  );
}

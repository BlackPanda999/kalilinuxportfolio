import { BadgeCheck } from "lucide-react";

import { certifications } from "@/data/profile";
import { Pane, PathBar, SectionTitle } from "./ui";

export function CertificationsApp() {
  const total = certifications.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      <PathBar path={`/home/blackpanda999/certifications/ — ${total} credentials`} />
      <Pane className="grid gap-6 sm:grid-cols-2">
        {certifications.map((group) => (
          <section key={group.group}>
            <SectionTitle>{group.group}</SectionTitle>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-foreground/85">
                  <BadgeCheck className="mt-0.5 size-4 shrink-0 text-shell" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Pane>
    </div>
  );
}

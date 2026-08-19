import { Package } from "lucide-react";

import { skills } from "@/data/profile";
import { Card, Chip, Pane, PageHeader, PathBar } from "./ui";

export function SkillsApp() {
  const total = skills.reduce((sum, group) => sum + group.items.length, 0);

  return (
    <div>
      <PathBar path="/usr/local/bin/ — installed toolkit" />
      <Pane className="space-y-7">
        <PageHeader
          kicker="package manager"
          title="Skills & toolkit"
          intro="Tools and platforms used day to day across offensive security, cloud, networking and IT operations."
          meta={
            <>
              <Chip>{total} tools</Chip>
              <Chip>{skills.length} categories</Chip>
            </>
          }
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((group, index) => (
            <Card key={group.group} className="p-5">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                  <Package className="size-4" />
                </span>
                <h3 className="font-sans text-sm font-semibold tracking-wide text-foreground">
                  {group.group}
                </h3>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")} · {group.items.length}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <Chip key={item}>{item}</Chip>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <p className="border-t border-border/60 pt-6 font-mono text-xs text-shell">
          $ sudo apt list --installed | wc -l → {total}
        </p>
      </Pane>
    </div>
  );
}

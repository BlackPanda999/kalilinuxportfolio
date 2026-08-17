import { Briefcase } from "lucide-react";

import { experience } from "@/data/profile";
import { Card, Chip, Pane, PageHeader, PathBar } from "./ui";

export function ExperienceApp() {
  return (
    <div>
      <PathBar path="/var/log/career.log" />
      <Pane className="space-y-9">
        <PageHeader
          kicker="career log"
          title="Experience"
          intro="Roles across IT support, infrastructure, AI integration and security operations — from help desk to penetration testing."
          meta={
            <>
              <Chip>{experience.length} roles</Chip>
              <Chip>5+ years</Chip>
              <Chip>Security · IT · Cloud</Chip>
            </>
          }
        />
        <ol className="relative space-y-6 border-l border-border/70 pl-7">
          {experience.map((job, index) => (
            <li key={`${job.role}-${job.company}`} className="relative">
              <span className="absolute top-6 -left-[2.15rem] grid size-5 place-items-center rounded-full border border-primary/50 bg-background">
                <span className="size-2 rounded-full bg-primary glow-primary" />
              </span>
              <Card className="p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                    {job.role}
                  </h3>
                  <span className="rounded-full border border-border/70 px-2.5 py-0.5 font-mono text-[11px] text-shell">
                    {job.period}
                  </span>
                </div>
                <p className="mt-1 inline-flex items-center gap-1.5 font-mono text-[11px] text-primary">
                  <Briefcase className="size-3.5" />
                  {job.company}
                </p>
                <ul className="mt-4 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-sm leading-[1.8] text-foreground/80">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-shell/70" />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="pointer-events-none absolute right-4 bottom-3 font-mono text-[10px] text-muted-foreground/50">
                  #{String(experience.length - index).padStart(2, "0")}
                </span>
              </Card>
            </li>
          ))}
        </ol>
      </Pane>
    </div>
  );
}

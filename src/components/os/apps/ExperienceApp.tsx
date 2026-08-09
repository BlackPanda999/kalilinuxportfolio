import { experience } from "@/data/profile";
import { Card, Pane, PageHeader, PathBar } from "./ui";

export function ExperienceApp() {
  return (
    <div>
      <PathBar path="/var/log/career.log" />
      <Pane className="space-y-8">
        <PageHeader
          kicker="career log"
          title="Experience"
          intro="Roles across IT support, infrastructure and security operations."
        />
        <ol className="relative space-y-6 border-l border-border/70 pl-7">
          {experience.map((job) => (
            <li key={`${job.role}-${job.company}`} className="relative">
              <span className="absolute top-5 -left-[2.05rem] size-3 rounded-full border-2 border-background bg-primary glow-primary" />
              <Card className="p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">{job.role}</h3>
                  <span className="font-mono text-[11px] text-shell">{job.period}</span>
                </div>
                <p className="mt-0.5 font-mono text-[11px] text-primary">{job.company}</p>
                <ul className="mt-3 space-y-2">
                  {job.points.map((point) => (
                    <li key={point} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                      <span className="text-shell">▸</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            </li>
          ))}
        </ol>
      </Pane>
    </div>
  );
}

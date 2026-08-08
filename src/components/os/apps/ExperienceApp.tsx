import { experience } from "@/data/profile";
import { Pane, PathBar } from "./ui";

export function ExperienceApp() {
  return (
    <div>
      <PathBar path="/var/log/career.log" />
      <Pane>
        <ol className="relative space-y-6 border-l border-border/70 pl-6">
          {experience.map((job) => (
            <li key={`${job.role}-${job.company}`} className="relative">
              <span className="absolute top-1.5 -left-[1.6rem] size-2.5 rounded-full bg-primary glow-primary" />
              <h3 className="text-base font-semibold text-foreground">{job.role}</h3>
              <p className="font-mono text-[11px] text-primary">
                {job.company} · {job.period}
              </p>
              <ul className="mt-2 space-y-1.5">
                {job.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-foreground/80">
                    <span className="text-shell">▸</span>
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Pane>
    </div>
  );
}

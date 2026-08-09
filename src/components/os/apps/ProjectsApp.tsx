import { FileCode2 } from "lucide-react";
import { useState } from "react";

import { projects } from "@/data/profile";
import { Chip, PathBar } from "./ui";
import { cn } from "@/lib/utils";

export function ProjectsApp() {
  const [selected, setSelected] = useState(0);
  const active = projects[selected]!;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <PathBar path={`/home/blackpanda999/projects/ — ${projects.length} items`} />
      <div className="flex min-h-0 flex-1 flex-col sm:flex-row">
        <ul className="term-scroll shrink-0 overflow-auto border-b border-border/70 bg-secondary/20 p-2 sm:max-h-none sm:w-64 sm:border-r sm:border-b-0">
          {projects.map((project, index) => (
            <li key={project.file}>
              <button
                type="button"
                onClick={() => setSelected(index)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-[11px] transition-colors",
                  index === selected
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <FileCode2 className="size-3.5 shrink-0" />
                <span className="truncate">{project.file}</span>
              </button>
            </li>
          ))}
        </ul>

        <article className="term-scroll min-h-0 flex-1 overflow-auto p-6 sm:p-8">
          <p className="font-mono text-[11px] tracking-[0.24em] text-shell uppercase">case study</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground">{active.name}</h3>
          {active.period && <p className="mt-1 font-mono text-[11px] text-primary">{active.period}</p>}
          <p className="mt-4 max-w-2xl border-l-2 border-primary/50 pl-4 text-[15px] leading-relaxed text-foreground/85">
            {active.summary}
          </p>
          <h4 className="mt-6 mb-3 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">
            <span className="h-px w-6 bg-primary/60" />
            what I did
          </h4>
          <ul className="space-y-2.5">
            {active.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-lg border border-border/60 bg-card/40 p-3.5 text-sm leading-relaxed text-foreground/80"
              >
                <span className="text-shell">$</span>
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-2">
            {active.stack.map((tool) => (
              <Chip key={tool}>{tool}</Chip>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

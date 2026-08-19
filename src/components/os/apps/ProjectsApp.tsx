import { FileCode2, FolderOpen } from "lucide-react";
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
        <ul className="term-scroll max-h-36 shrink-0 overflow-y-auto border-b border-border/70 bg-secondary/20 p-2 sm:max-h-none sm:w-64 sm:border-r sm:border-b-0 lg:w-72">
          <li className="flex items-center gap-2 px-3 py-2 font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            <FolderOpen className="size-3.5" /> projects
          </li>
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

        <article className="term-scroll grid-mesh ambient-glow prose-app prose-term min-h-0 flex-1 overflow-y-auto p-4 sm:p-7 lg:p-9">
          <p className="inline-flex items-center gap-2 rounded-full border border-shell/30 bg-shell/10 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-shell uppercase">
            <span className="size-1.5 rounded-full bg-shell caret-blink" /> case study
          </p>
          <h3 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-[2rem]">
            {active.name}
          </h3>
          {active.period && <p className="mt-1.5 font-mono text-[11px] text-primary">{active.period}</p>}
          <p className="mt-4 max-w-2xl border-l-2 border-primary/50 pl-5 text-[15.5px] leading-[1.9] text-foreground/85">
            {active.summary}
          </p>

          <h4 className="mt-8 mb-4 flex items-center gap-3 font-sans text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
            <span className="h-px w-6 bg-primary/60" />
            what I did
            <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </h4>
          <ul className="grid gap-2.5 xl:grid-cols-2">
            {active.points.map((point) => (
              <li
                key={point}
                className="flex gap-3 rounded-lg border border-border/50 bg-terminal/50 px-3.5 py-3 text-sm leading-[1.8] text-foreground/85 transition-colors hover:border-shell/40"
              >
                <span className="font-mono text-shell">$</span>
                {point}
              </li>
            ))}
          </ul>

          <h4 className="mt-8 mb-3 flex items-center gap-3 font-sans text-[11px] font-semibold tracking-[0.22em] text-primary uppercase">
            <span className="h-px w-6 bg-primary/60" />
            stack
            <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </h4>
          <div className="flex flex-wrap gap-2">
            {active.stack.map((tool) => (
              <Chip key={tool}>{tool}</Chip>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

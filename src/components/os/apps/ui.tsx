import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Pane({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-6 sm:p-8", className)}>{children}</div>;
}

export function PathBar({ path }: { path: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-border/70 bg-secondary/40 px-4 py-2 font-mono text-[11px] text-muted-foreground">
      <span className="inline-flex gap-1">
        <i className="size-2 rounded-full bg-destructive/70" />
        <i className="size-2 rounded-full bg-warn/70" />
        <i className="size-2 rounded-full bg-shell/70" />
      </span>
      <span className="truncate">{path}</span>
    </div>
  );
}

/** Editorial section heading — small kicker + big title, website style. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] text-primary uppercase">
      <span className="h-px w-6 bg-primary/60" />
      {children}
    </h3>
  );
}

export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="border-b border-border/60 pb-6">
      <p className="font-mono text-[11px] tracking-[0.24em] text-shell uppercase">{kicker}</p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{intro}</p>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/50",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary/90">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-card/40 px-4 py-3">
      <p className="font-mono text-xl font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Pane({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("prose-app grid-mesh relative p-6 sm:p-10", className)}>{children}</div>
  );
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
      <span className="ml-auto hidden font-mono text-[10px] tracking-[0.18em] text-shell/70 uppercase sm:inline">
        secure shell
      </span>
    </div>
  );
}

/** Editorial section heading — numbered kicker + rule, website style. */
export function SectionTitle({ children, index }: { children: ReactNode; index?: number }) {
  return (
    <h3 className="mb-5 flex items-center gap-3 font-sans text-xs font-semibold tracking-[0.18em] text-primary uppercase">
      {index !== undefined && (
        <span className="font-mono text-[10px] text-shell/80">
          {String(index).padStart(2, "0")}
        </span>
      )}
      <span className="h-px w-6 bg-primary/60" />
      {children}
      <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </h3>
  );
}

export function PageHeader({
  kicker,
  title,
  intro,
  meta,
}: {
  kicker: string;
  title: string;
  intro?: string;
  meta?: ReactNode;
}) {
  return (
    <header className="relative border-b border-border/60 pb-8">
      <p className="inline-flex items-center gap-2 rounded-full border border-shell/30 bg-shell/10 px-3 py-1 font-mono text-[10px] tracking-[0.22em] text-shell uppercase">
        <span className="size-1.5 rounded-full bg-shell caret-blink" />
        {kicker}
      </p>
      <h2 className="mt-4 font-sans text-[1.8rem] leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-[2.6rem]">
        {title}
        <span className="ml-1 text-primary">_</span>
      </h2>
      {intro && (
        <p className="mt-4 max-w-2xl text-[0.97rem] leading-[1.85] text-muted-foreground">
          {intro}
        </p>
      )}
      {meta && <div className="mt-5 flex flex-wrap gap-2">{meta}</div>}
    </header>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border/70 bg-card/40 p-5 leading-relaxed transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60 hover:shadow-[0_12px_28px_-18px_var(--color-primary)]",
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      {children}
    </div>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[11px] text-primary/90 transition-colors hover:border-primary/60 hover:text-primary">
      {children}
    </span>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-border/60 bg-card/40 px-4 py-3.5">
      <span className="absolute inset-y-0 left-0 w-0.5 bg-primary/70" />
      <p className="font-mono text-2xl font-bold text-primary">{value}</p>
      <p className="mt-0.5 text-[11px] tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

/** Terminal-flavoured line used for bullet lists in a hacker register. */
export function CmdLine({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-lg border border-border/50 bg-terminal/50 px-3.5 py-3 text-sm leading-relaxed text-foreground/85 transition-colors hover:border-shell/40">
      <span className="font-mono text-shell">$</span>
      <span>{children}</span>
    </li>
  );
}

export function Meter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between font-mono text-[11px]">
        <span className="text-foreground/85">{label}</span>
        <span className="text-shell">{value}%</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/70">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-shell"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

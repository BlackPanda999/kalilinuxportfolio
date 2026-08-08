import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function Pane({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("p-5 sm:p-6", className)}>{children}</div>;
}

export function PathBar({ path }: { path: string }) {
  return (
    <div className="border-b border-border/70 bg-secondary/40 px-4 py-2 font-mono text-[11px] text-muted-foreground">
      {path}
    </div>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 font-mono text-[11px] tracking-[0.18em] text-primary uppercase">{children}</h3>
  );
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-sm border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-foreground/80">
      {children}
    </span>
  );
}

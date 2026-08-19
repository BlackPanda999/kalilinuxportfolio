import { useEffect, useMemo, useRef, useState } from "react";
import { CornerDownLeft, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppId } from "./types";

export type PaletteItem = {
  id: AppId | "wallpaper";
  label: string;
  hint: string;
  keywords: string;
  icon: React.ReactNode;
};

export function CommandPalette({
  open,
  items,
  onClose,
  onRun,
}: {
  open: boolean;
  items: PaletteItem[];
  onClose: () => void;
  onRun: (id: PaletteItem["id"]) => void;
}) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint} ${item.keywords}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  useEffect(() => {
    if (!open) return undefined;
    setQuery("");
    setActive(0);
    const focus = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(focus);
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  function commit(index: number) {
    const item = results[index];
    if (!item) return;
    onRun(item.id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center bg-background/70 p-4 pt-[12vh] backdrop-blur-sm animate-in fade-in duration-150"
      onPointerDown={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-label="Command palette"
        onPointerDown={(event) => event.stopPropagation()}
        className="window-shadow scanlines-soft w-full max-w-lg overflow-hidden rounded-xl border border-primary/40 animate-in zoom-in-95 duration-150"
        style={{ backgroundColor: "var(--color-card)" }}
      >
        <div className="flex items-center gap-2.5 border-b border-border/70 px-4 py-3">
          <Search className="size-4 shrink-0 text-primary" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActive((i) => (i + 1) % Math.max(results.length, 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActive((i) => (i - 1 + results.length) % Math.max(results.length, 1));
              }
              if (event.key === "Enter") {
                event.preventDefault();
                commit(active);
              }
              if (event.key === "Escape") onClose();
            }}
            placeholder="run a command… about, projects, certs, cv"
            aria-label="Search apps and commands"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 bg-transparent font-mono text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-border/70 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:block">
            esc
          </kbd>
        </div>

        <ul className="term-scroll max-h-[52vh] overflow-auto p-2">
          {results.length === 0 && (
            <li className="px-3 py-6 text-center font-mono text-xs text-muted-foreground">
              no matching command
            </li>
          )}
          {results.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onPointerEnter={() => setActive(index)}
                onClick={() => commit(index)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors [&_svg]:size-4",
                  index === active
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/85 hover:bg-secondary/60",
                )}
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-md border border-border/70 bg-secondary/40">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{item.label}</span>
                  <span className="block truncate font-mono text-[10.5px] text-muted-foreground">
                    {item.hint}
                  </span>
                </span>
                {index === active && <CornerDownLeft className="shrink-0 opacity-70" />}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 border-t border-border/70 bg-secondary/25 px-4 py-2 font-mono text-[10px] text-muted-foreground">
          <span>↑↓ navigate</span>
          <span>⏎ open</span>
          <span className="ml-auto text-shell/80">ctrl+k</span>
        </div>
      </div>
    </div>
  );
}

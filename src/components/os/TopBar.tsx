import { useEffect, useState } from "react";
import {
  Bell,
  Bot,
  FolderClosed,
  Lock,
  Monitor,
  Power,
  Search,
  ShieldCheck,
  Terminal as TerminalIcon,
  UserRound,
  Volume2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { AppId } from "./types";

const QUICK: { id: AppId; label: string; icon: typeof Bot }[] = [
  { id: "about", label: "About Me", icon: UserRound },
  { id: "projects", label: "Projects", icon: FolderClosed },
  { id: "terminal", label: "Terminal", icon: TerminalIcon },
  { id: "ai", label: "Ask AI", icon: Bot },
];

export function TopBar({
  onOpen,
  onSearch,
}: {
  onOpen?: (id: AppId) => void;
  onSearch?: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [workspace, setWorkspace] = useState(1);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="panel-blur relative z-[9000] flex h-[36px] items-center gap-1.5 border-b border-border/60 px-2 font-mono text-[11px] text-panel-foreground">
      {/* launcher */}
      <button
        type="button"
        title="PandaOS menu — search apps (Ctrl+K)"
        onClick={onSearch}
        className="flex items-center gap-1.5 rounded px-1.5 py-1 text-primary transition-colors hover:bg-primary/15"
      >
        <ShieldCheck className="size-4" />
      </button>

      <span className="h-4 w-px bg-border/70" />

      {/* quick-launch tray */}
      <div className="flex items-center gap-0.5">
        {QUICK.map((item) => (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={() => onOpen?.(item.id)}
            className="grid size-7 place-items-center rounded text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground [&_svg]:size-4"
          >
            <item.icon />
          </button>
        ))}
      </div>

      <span className="h-4 w-px bg-border/70" />

      {/* workspaces */}
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            title={`Workspace ${n}`}
            onClick={() => setWorkspace(n)}
            className={cn(
              "size-6 rounded text-center leading-6 transition-colors",
              workspace === n
                ? "bg-primary/20 text-primary"
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
            )}
          >
            {n}
          </button>
        ))}
      </div>

      <span className="h-4 w-px bg-border/70" />

      <button
        type="button"
        onClick={onSearch}
        title="Search apps and commands (Ctrl+K)"
        className="hidden items-center gap-1.5 rounded px-2 py-1 text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground sm:flex"
      >
        <Search className="size-3.5" />
        <span className="hidden md:inline">search</span>
        <kbd className="hidden rounded border border-border/70 px-1 text-[9.5px] md:inline">
          ctrl k
        </kbd>
      </button>

      <span className="hidden truncate text-muted-foreground lg:inline">
        blackpanda999@kali: ~
      </span>

      {/* right status tray */}
      <div className="ml-auto flex items-center gap-1">
        <span className="mr-1 hidden h-1 w-16 overflow-hidden rounded-full bg-secondary/80 sm:block">
          <span className="block h-full w-1/2 rounded-full bg-primary" />
        </span>
        {[Monitor, Volume2, Bell, Power].map((Icon, i) => (
          <span
            key={i}
            className="grid size-6 place-items-center text-muted-foreground [&_svg]:size-3.5"
          >
            <Icon />
          </span>
        ))}
        <time className="px-1 text-foreground/90">
          {now
            ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : "--:--"}
        </time>
        <span className="grid size-6 place-items-center text-shell [&_svg]:size-3.5">
          <Lock />
        </span>
      </div>
    </header>
  );
}

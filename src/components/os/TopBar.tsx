import { useEffect, useState } from "react";
import {
  BatteryFull,
  Bell,
  Bot,
  Cpu,
  FolderClosed,
  ImageIcon,
  Lock,
  ShieldCheck,
  Terminal as TerminalIcon,
  UserRound,
  Volume2,
  Wifi,
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
  onWallpaper,
}: {
  onOpen?: (id: AppId) => void;
  onWallpaper?: () => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [workspace, setWorkspace] = useState(1);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="panel-blur scanlines-soft relative z-[9000] flex h-[2.35rem] items-center gap-1.5 border-b border-border/60 px-2 font-mono text-[11px] text-panel-foreground">
      {/* distro mark */}
      <span className="flex items-center gap-1.5 rounded-md bg-primary/12 px-2 py-1 text-primary">
        <ShieldCheck className="size-4" />
        <span className="hidden text-[10.5px] font-semibold tracking-[0.16em] sm:inline">
          PandaOS 26.04
        </span>
      </span>

      <span className="h-4 w-px bg-border/70" />

      {/* quick-launch dock */}
      <div className="flex items-center gap-0.5">
        {QUICK.map((item) => (
          <button
            key={item.id}
            type="button"
            title={item.label}
            onClick={() => onOpen?.(item.id)}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-primary [&_svg]:size-4"
          >
            <item.icon />
          </button>
        ))}
      </div>

      <span className="h-4 w-px bg-border/70" />

      {/* workspaces */}
      <div className="flex items-center gap-1 rounded-md bg-secondary/40 px-1 py-0.5">
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            title={`Workspace ${n}`}
            onClick={() => setWorkspace(n)}
            className={cn(
              "size-2 rounded-full transition-all",
              workspace === n
                ? "w-5 bg-primary shadow-[0_0_8px_var(--color-primary)]"
                : "bg-muted-foreground/50 hover:bg-muted-foreground",
            )}
          >
            <span className="sr-only">{n}</span>
          </button>
        ))}
      </div>

      <span className="ml-2 hidden truncate text-muted-foreground lg:inline">
        blackpanda999@kali: ~
      </span>

      {/* right status tray */}
      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden items-center gap-1 text-shell md:flex">
          <Cpu className="size-3.5" />
          <span className="text-[10px]">7%</span>
        </span>
        <button
          type="button"
          onClick={onWallpaper}
          title="Change wallpaper"
          className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-primary [&_svg]:size-3.5"
        >
          <ImageIcon />
        </button>
        {[Wifi, Volume2, Bell, BatteryFull].map((Icon, i) => (
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

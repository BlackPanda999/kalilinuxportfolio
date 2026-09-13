import { useEffect, useState } from "react";
import {
  BatteryFull,
  Bell,
  Bot,
  Cpu,
  FolderClosed,
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
}: {
  onOpen?: (id: AppId) => void;
}) {
  const [now, setNow] = useState<Date | null>(null);
  const [workspace, setWorkspace] = useState(1);
  const [wifi, setWifi] = useState(true);
  const [sound, setSound] = useState(true);
  const [notifications, setNotifications] = useState(true);

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
          Blackpanda Team
        </span>
      </span>

      <span className="h-4 w-px bg-border/70" />

      {/* quick-launch dock */}
      <div className="flex items-center gap-0.5" role="group" aria-label="Quick launch dock">
        {QUICK.map((item) => (
          <button
            key={item.id}
            type="button"
            title={`Open ${item.label}`}
            aria-label={`Open ${item.label}`}
            onClick={() => onOpen?.(item.id)}
            className="grid size-7 place-items-center rounded-md text-muted-foreground transition-all hover:-translate-y-px hover:bg-secondary/70 hover:text-primary [&_svg]:size-4"
          >
            <item.icon />
          </button>
        ))}
      </div>

      <span className="h-4 w-px bg-border/70" />

      {/* workspaces */}
      <div
        className="flex items-center gap-1 rounded-md bg-secondary/40 px-1 py-0.5"
        role="group"
        aria-label="Workspaces"
      >
        {[1, 2, 3, 4].map((n) => (
          <button
            key={n}
            type="button"
            title={`Switch to workspace ${n}`}
            aria-label={`Switch to workspace ${n}`}
            aria-pressed={workspace === n}
            onClick={() => setWorkspace(n)}
            className={cn(
              "size-2 rounded-full transition-all",
              workspace === n
                ? "w-5 bg-primary shadow-[0_0_8px_var(--color-primary)]"
                : "bg-muted-foreground/50 hover:bg-muted-foreground",
            )}
          >
            <span className="sr-only">Workspace {n}</span>
          </button>
        ))}
      </div>

      <span className="ml-2 hidden truncate text-muted-foreground lg:inline">
        blackpanda999@kali: ~
      </span>

      {/* right status tray */}
      <div className="ml-auto flex items-center gap-1.5" role="group" aria-label="System tray">
        <span className="hidden items-center gap-1 text-shell md:flex" title="CPU active · load 7%">
          <Cpu className="size-3.5" aria-hidden="true" />
          <span className="text-[10px]">7%</span>
          <span className="sr-only">CPU load 7 percent</span>
        </span>
        <button
          type="button"
          onClick={() => setWifi((value) => !value)}
          title={wifi ? "Wi-Fi connected · click to disconnect" : "Wi-Fi offline · click to connect"}
          aria-label={wifi ? "Disconnect Wi-Fi" : "Connect Wi-Fi"}
          aria-pressed={wifi}
          className={cn(
            "status-control",
            wifi ? "text-shell" : "text-muted-foreground",
          )}
        >
          <Wifi aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setSound((value) => !value)}
          title={sound ? "Sound on · volume 60% · click to mute" : "Sound muted · click to unmute"}
          aria-label={sound ? "Mute sound" : "Unmute sound"}
          aria-pressed={sound}
          className={cn(
            "status-control",
            sound ? "text-shell" : "text-muted-foreground opacity-60",
          )}
        >
          <Volume2 aria-hidden="true" />
          {!sound && <span className="absolute h-px w-4 rotate-45 bg-current" />}
        </button>
        <button
          type="button"
          onClick={() => setNotifications((value) => !value)}
          title={notifications ? "Notifications enabled · click to silence" : "Notifications silenced · click to enable"}
          aria-label={notifications ? "Silence notifications" : "Enable notifications"}
          aria-pressed={notifications}
          className={cn(
            "status-control",
            notifications ? "text-shell" : "text-muted-foreground opacity-60",
          )}
        >
          <Bell aria-hidden="true" />
        </button>
        <span
          title="Battery charged · 100%"
          aria-label="Battery charged, 100 percent"
          role="img"
          className="status-control text-shell"
        >
          <BatteryFull aria-hidden="true" />
        </span>

        <time className="px-1 text-foreground/90" title="System clock">
          {now
            ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : "--:--"}
        </time>
        <span
          className="status-control text-shell"
          title="Session locked · secure boot"
          aria-label="Session secured"
          role="img"
        >
          <Lock aria-hidden="true" />
        </span>

      </div>
    </header>
  );
}

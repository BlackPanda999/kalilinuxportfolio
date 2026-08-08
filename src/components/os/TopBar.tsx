import { useEffect, useState } from "react";
import { Cpu, ShieldCheck, Wifi } from "lucide-react";

import { profile } from "@/data/profile";

export function TopBar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="panel-blur relative z-[9000] flex h-[34px] items-center gap-3 border-b border-border/60 px-3 font-mono text-[11px] text-panel-foreground">
      <span className="flex items-center gap-1.5 text-primary">
        <ShieldCheck className="size-3.5" />
        PandaOS
      </span>
      <span className="hidden text-muted-foreground sm:inline">
        {profile.handle}@{profile.host}
      </span>
      <span className="ml-auto flex items-center gap-3 text-muted-foreground">
        <span className="hidden items-center gap-1.5 sm:flex">
          <Cpu className="size-3.5" />
          load 0.12
        </span>
        <span className="flex items-center gap-1.5">
          <Wifi className="size-3.5 text-shell" />
          secure
        </span>
        <time className="text-foreground/90">
          {now
            ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false })
            : "--:--"}
        </time>
      </span>
    </header>
  );
}

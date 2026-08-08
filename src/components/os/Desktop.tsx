import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bot,
  BadgeCheck,
  FileText,
  FolderClosed,
  Mail,
  ScrollText,
  Terminal as TerminalIcon,
  UserRound,
  Wrench,
} from "lucide-react";

import wallpaper from "@/assets/wallpaper.jpg";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";
import { BootScreen } from "./BootScreen";
import { TopBar } from "./TopBar";
import { Window } from "./Window";
import type { AppId, WindowState } from "./types";
import { AboutApp } from "./apps/AboutApp";
import { AiApp } from "./apps/AiApp";
import { CertificationsApp } from "./apps/CertificationsApp";
import { ContactApp } from "./apps/ContactApp";
import { CvApp } from "./apps/CvApp";
import { ExperienceApp } from "./apps/ExperienceApp";
import { ProjectsApp } from "./apps/ProjectsApp";
import { SkillsApp } from "./apps/SkillsApp";
import { TerminalApp } from "./apps/TerminalApp";

type AppDef = {
  id: AppId;
  label: string;
  title: string;
  icon: ReactNode;
  w: number;
  h: number;
};

const APPS: AppDef[] = [
  {
    id: "about",
    label: "About Me",
    title: "about_me.txt — Text Editor",
    icon: <UserRound />,
    w: 720,
    h: 560,
  },
  {
    id: "projects",
    label: "Projects",
    title: "~/projects — File Manager",
    icon: <FolderClosed />,
    w: 820,
    h: 520,
  },
  {
    id: "certifications",
    label: "Certifications",
    title: "~/certifications — File Manager",
    icon: <BadgeCheck />,
    w: 800,
    h: 560,
  },
  {
    id: "experience",
    label: "Experience",
    title: "career.log — Log Viewer",
    icon: <ScrollText />,
    w: 760,
    h: 560,
  },
  { id: "skills", label: "Skills", title: "toolkit — Package Manager", icon: <Wrench />, w: 700, h: 480 },
  { id: "cv", label: "CV", title: "~/cv — File Manager", icon: <FileText />, w: 660, h: 420 },
  { id: "contact", label: "Contact", title: "contact.conf — Editor", icon: <Mail />, w: 620, h: 440 },
  { id: "ai", label: "Ask AI", title: "panda-ai — Assistant", icon: <Bot />, w: 660, h: 520 },
  { id: "terminal", label: "Terminal", title: "blackpanda999@kali: ~", icon: <TerminalIcon />, w: 700, h: 440 },
];

export function Desktop() {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focused, setFocused] = useState<AppId | null>(null);
  const zRef = useRef(10);
  const openCount = useRef(0);

  function focus(id: AppId) {
    zRef.current += 1;
    const z = zRef.current;
    setFocused(id);
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, z, minimized: false } : w)));
  }

  function open(id: AppId) {
    const app = APPS.find((entry) => entry.id === id);
    if (!app) return;
    setWindows((prev) => {
      if (prev.some((w) => w.id === id)) return prev;
      zRef.current += 1;
      const offset = openCount.current * 28;
      openCount.current = (openCount.current + 1) % 6;
      const maxW = typeof window !== "undefined" ? window.innerWidth : 1280;
      const maxH = typeof window !== "undefined" ? window.innerHeight : 800;
      const w = Math.min(app.w, maxW - 40);
      const h = Math.min(app.h, maxH - 140);
      return [
        ...prev,
        {
          id,
          x: Math.max(16, Math.round((maxW - w) / 2) + offset - 60),
          y: Math.max(48, Math.round((maxH - h) / 2) + offset - 40),
          w,
          h,
          z: zRef.current,
          minimized: false,
          maximized: maxW < 720,
        },
      ];
    });
    setFocused(id);
  }

  function close(id: AppId) {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setFocused((current) => (current === id ? null : current));
  }

  function update(id: AppId, patch: Partial<WindowState>) {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  }

  useEffect(() => {
    if (booted && windows.length === 0) open("about");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booted]);

  const content = useMemo<Record<AppId, ReactNode>>(
    () => ({
      about: <AboutApp />,
      projects: <ProjectsApp />,
      certifications: <CertificationsApp />,
      experience: <ExperienceApp />,
      skills: <SkillsApp />,
      cv: <CvApp />,
      contact: <ContactApp />,
      ai: <AiApp />,
      terminal: <TerminalApp onOpen={open} />,
    }),
    [],
  );

  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        src={wallpaper}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-background/55" />

      <div className="relative flex h-full flex-col">
        <TopBar />

        <main className="relative min-h-0 flex-1">
          <h1 className="sr-only">
            {profile.name} — {profile.titles.join(", ")}
          </h1>

          {/* desktop icons */}
          <ul className="absolute top-4 left-4 grid max-h-[calc(100%-2rem)] grid-flow-col grid-rows-6 gap-1">
            {APPS.map((app) => (
              <li key={app.id}>
                <button
                  type="button"
                  onDoubleClick={() => open(app.id)}
                  onClick={() => open(app.id)}
                  className="group flex w-24 flex-col items-center gap-1.5 rounded-md p-2 text-center transition-colors hover:bg-primary/15 focus-visible:bg-primary/15 focus-visible:outline-none"
                >
                  <span className="grid size-11 place-items-center rounded-md border border-border/70 bg-card/70 text-primary [&_svg]:size-5 group-hover:border-primary/60">
                    {app.icon}
                  </span>
                  <span className="font-mono text-[10.5px] leading-tight text-foreground/90">
                    {app.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {windows.map((state) => {
            const app = APPS.find((entry) => entry.id === state.id)!;
            return (
              <Window
                key={state.id}
                state={state}
                title={app.title}
                icon={app.icon}
                active={focused === state.id}
                onFocus={() => focus(state.id)}
                onClose={() => close(state.id)}
                onMinimize={() => update(state.id, { minimized: true })}
                onToggleMaximize={() => update(state.id, { maximized: !state.maximized })}
                onMove={(x, y) => update(state.id, { x, y })}
                onResize={(w, h) => update(state.id, { w, h })}
              >
                {content[state.id]}
              </Window>
            );
          })}
        </main>

        {/* taskbar */}
        <footer className="panel-blur relative z-[9000] flex h-[3.25rem] shrink-0 items-center gap-2 border-t border-border/60 px-3">
          <span className="hidden font-mono text-[11px] text-primary sm:inline">▚ apps</span>
          <ul className="term-scroll flex flex-1 items-center gap-1.5 overflow-x-auto">
            {APPS.map((app) => {
              const state = windows.find((w) => w.id === app.id);
              return (
                <li key={app.id}>
                  <button
                    type="button"
                    onClick={() => (state ? (state.minimized ? focus(app.id) : update(app.id, { minimized: true })) : open(app.id))}
                    title={app.label}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors [&_svg]:size-4",
                      state
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-transparent text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {app.icon}
                    <span className="hidden md:inline">{app.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </footer>
      </div>
    </div>
  );
}

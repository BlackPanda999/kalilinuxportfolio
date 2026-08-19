import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bot,
  BadgeCheck,
  FileText,
  FolderClosed,
  ImageIcon,
  Mail,
  ScrollText,
  Search,
  Terminal as TerminalIcon,
  UserRound,
  Wrench,
} from "lucide-react";

import { profile } from "@/data/profile";
import { randomWallpaperIndex, wallpapers } from "@/data/wallpapers";
import { cn } from "@/lib/utils";
import { CTF_BANNER } from "@/lib/ctf";
import { BootScreen } from "./BootScreen";
import { CommandPalette, type PaletteItem } from "./CommandPalette";
import { Hero } from "./Hero";
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
  hint: string;
  icon: ReactNode;
  tone: string;
  w: number;
  h: number;
};

const APPS: AppDef[] = [
  {
    id: "about",
    label: "About Me",
    title: "about_me.txt — Text Editor",
    hint: "profile",
    icon: <UserRound />,
    tone: "text-primary",
    w: 760,
    h: 580,
  },
  {
    id: "projects",
    label: "Projects",
    title: "~/projects — File Manager",
    hint: "9 items",
    icon: <FolderClosed />,
    tone: "text-warn",
    w: 860,
    h: 560,
  },
  {
    id: "certifications",
    label: "Certifications",
    title: "~/certifications — File Manager",
    hint: "30+",
    icon: <BadgeCheck />,
    tone: "text-shell",
    w: 840,
    h: 580,
  },
  {
    id: "experience",
    label: "Experience",
    title: "career.log — Log Viewer",
    hint: "career.log",
    icon: <ScrollText />,
    tone: "text-primary",
    w: 800,
    h: 580,
  },
  {
    id: "skills",
    label: "Skills",
    title: "toolkit — Package Manager",
    hint: "toolkit",
    icon: <Wrench />,
    tone: "text-shell",
    w: 740,
    h: 520,
  },
  {
    id: "cv",
    label: "CV",
    title: "~/cv — File Manager",
    hint: "2 PDFs",
    icon: <FileText />,
    tone: "text-warn",
    w: 700,
    h: 460,
  },
  {
    id: "contact",
    label: "Contact",
    title: "contact.conf — Editor",
    hint: "reach out",
    icon: <Mail />,
    tone: "text-primary",
    w: 660,
    h: 480,
  },
  {
    id: "ai",
    label: "Ask AI",
    title: "panda-ai — Assistant",
    hint: "panda-ai",
    icon: <Bot />,
    tone: "text-shell",
    w: 700,
    h: 560,
  },
  {
    id: "terminal",
    label: "Terminal",
    title: "blackpanda999@kali: ~",
    hint: "zsh",
    icon: <TerminalIcon />,
    tone: "text-shell",
    w: 740,
    h: 460,
  },
];

export function Desktop() {
  const [booted, setBooted] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [focused, setFocused] = useState<AppId | null>(null);
  const [paper, setPaper] = useState(0);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const zRef = useRef(10);
  const openCount = useRef(0);

  // pick a random wallpaper per page load (client-side to keep SSR stable)
  useEffect(() => setPaper(randomWallpaperIndex()), []);

  // ctrl/cmd+K opens the command palette anywhere on the desktop
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // friendly easter-egg breadcrumb for anyone who opens devtools
  useEffect(() => {
    if (!booted) return;
    console.info("%c" + CTF_BANNER, "color:#7aa2f7");
    console.info("open the Terminal app and type `ctf` to play.");
  }, [booted]);

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

  const paletteItems = useMemo<PaletteItem[]>(
    () => [
      ...APPS.map((app) => ({
        id: app.id,
        label: app.label,
        hint: app.title,
        keywords: `${app.hint} ${app.id} open launch window`,
        icon: app.icon,
      })),
      {
        id: "wallpaper" as const,
        label: "Change wallpaper",
        hint: "cycle desktop background",
        keywords: "theme background image paper",
        icon: <ImageIcon />,
      },
    ],
    [],
  );

  const runPalette = useCallback((id: PaletteItem["id"]) => {
    if (id === "wallpaper") {
      setPaper((p) => (p + 1) % wallpapers.length);
      return;
    }
    open(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <img
        key={paper}
        src={wallpapers[paper]}
        alt=""
        width={1920}
        height={1088}
        className="absolute inset-0 size-full animate-in object-cover duration-700 fade-in"
      />
      <div className="absolute inset-0 bg-background/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 0%, oklch(0.1 0.02 260 / 0.55) 75%)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <TopBar onOpen={open} onSearch={() => setPaletteOpen(true)} />

        <main className="relative min-h-0 flex-1">
          <h1 className="sr-only">
            {profile.name} — {profile.titles.join(", ")}
          </h1>

          {/* centered desktop launcher */}
          <div className="term-scroll absolute inset-0 flex items-center justify-center overflow-y-auto px-3 py-5 sm:p-6">
            <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8">
              <Hero />

              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="group flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-border/70 bg-card/40 px-4 py-2.5 font-mono text-[11.5px] text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/60 hover:text-foreground"
              >
                <Search className="size-3.5 text-primary" />
                <span className="flex-1 text-left">search apps &amp; commands…</span>
                <kbd className="rounded border border-border/70 px-1.5 py-0.5 text-[10px]">
                  ctrl k
                </kbd>
              </button>

              <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 sm:gap-5">
                {APPS.map((app, i) => (
                  <li key={app.id} className="icon-pop" style={{ animationDelay: `${i * 55}ms` }}>
                    <button
                      type="button"
                      onDoubleClick={() => open(app.id)}
                      onClick={() => open(app.id)}
                      className="group flex w-[5.75rem] flex-col items-center gap-2 rounded-xl p-2 focus-visible:outline-none sm:w-24"
                    >
                      <span
                        className={cn(
                          "icon-3d relative grid size-16 place-items-center rounded-2xl border border-border/70 backdrop-blur-md",
                          "transition-transform duration-300 ease-out will-change-transform",
                          "group-hover:-translate-y-1.5 group-hover:scale-110 group-active:scale-95",
                          "group-hover:border-primary/70 group-hover:glow-primary group-focus-visible:border-primary",
                          "[&_svg]:size-7 [&_svg]:drop-shadow-[0_2px_3px_oklch(0_0_0/0.6)] [&_svg]:stroke-[1.9]",
                          app.tone,
                        )}
                      >
                        <span className="absolute inset-x-3 top-0.5 h-px rounded-full bg-foreground/25" />
                        {app.icon}
                      </span>
                      <span className="font-sans text-[11px] font-medium leading-tight text-foreground/90 transition-colors group-hover:text-primary">
                        {app.label}
                      </span>
                      <span className="font-mono text-[9.5px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                        {app.hint}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

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

        {/* taskbar — only running windows */}
        <footer className="panel-blur relative z-[9000] flex h-[3.25rem] shrink-0 items-center gap-3 border-t border-border/60 px-3">
          <span className="hidden font-mono text-[11px] text-primary sm:inline">▚ running</span>
          <ul className="term-scroll flex flex-1 items-center gap-1.5 overflow-x-auto">
            {windows.length === 0 && (
              <li className="font-mono text-[11px] text-muted-foreground">no windows open</li>
            )}
            {windows.map((state) => {
              const app = APPS.find((entry) => entry.id === state.id)!;
              return (
                <li key={state.id}>
                  <button
                    type="button"
                    onClick={() =>
                      state.minimized ? focus(state.id) : update(state.id, { minimized: true })
                    }
                    title={app.label}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors [&_svg]:size-4",
                      focused === state.id && !state.minimized
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border/60 text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                    )}
                  >
                    {app.icon}
                    <span className="hidden sm:inline">{app.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            title="Command palette (Ctrl+K)"
            className="flex shrink-0 items-center gap-2 rounded-md border border-border/60 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary [&_svg]:size-4"
          >
            <Search />
            <span className="hidden sm:inline">search</span>
          </button>
          <button
            type="button"
            onClick={() => setPaper((p) => (p + 1) % wallpapers.length)}
            title="Change wallpaper"
            className="flex shrink-0 items-center gap-2 rounded-md border border-border/60 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary [&_svg]:size-4"
          >
            <ImageIcon />
            <span className="hidden sm:inline">wallpaper</span>
          </button>
        </footer>
      </div>

      <CommandPalette
        open={paletteOpen}
        items={paletteItems}
        onClose={() => setPaletteOpen(false)}
        onRun={runPalette}
      />
    </div>
  );
}

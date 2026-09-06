import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Bot,
  BadgeCheck,
  FileText,
  FolderClosed,
  ImageIcon,
  Mail,
  ScrollText,
  ShieldCheck,
  Terminal as TerminalIcon,
  UserRound,
  Wrench,
} from "lucide-react";

import { profile } from "@/data/profile";
import { randomWallpaperIndex, wallpapers } from "@/data/wallpapers";
import { cn } from "@/lib/utils";
import { CTF_BANNER } from "@/lib/ctf";
import { BootScreen } from "./BootScreen";
import { Hero } from "./Hero";
import { TopBar } from "./TopBar";
import { WallpaperPicker } from "./WallpaperPicker";
import { Window } from "./Window";

import type { AppId, WindowState } from "./types";
import { AboutApp } from "./apps/AboutApp";
import { AiApp } from "./apps/AiApp";
import { CertificationsApp } from "./apps/CertificationsApp";
import { ContactApp } from "./apps/ContactApp";
import { CvApp } from "./apps/CvApp";
import { CyberApp } from "./apps/CyberApp";
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
    id: "cyber",
    label: "Cyber Security",
    title: "roadmap.md — Cyber Security Academy",
    hint: "zero → hero",
    icon: <ShieldCheck />,
    tone: "text-shell",
    w: 900,
    h: 620,
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
  const [picker, setPicker] = useState(false);

  const zRef = useRef(10);
  const openCount = useRef(0);

  // pick a random wallpaper per page load (client-side to keep SSR stable)
  useEffect(() => setPaper(randomWallpaperIndex()), []);


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
      cyber: <CyberApp />,
      contact: <ContactApp />,
      ai: <AiApp />,
      terminal: <TerminalApp onOpen={open} />,
    }),
    [],
  );




  if (!booted) return <BootScreen onDone={() => setBooted(true)} />;

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {wallpapers.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover transition-opacity duration-700 ease-out"
          style={{ opacity: paper === i ? 1 : 0 }}
        />
      ))}
      <div className="absolute inset-0 bg-background/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 0%, oklch(0.1 0.02 260 / 0.55) 75%)",
        }}
      />

      <div className="relative flex h-full flex-col">
        <TopBar onOpen={open} onWallpaper={() => setPicker((v) => !v)} />


        <main className="relative min-h-0 flex-1">
          <h1 className="sr-only">
            {profile.name} — {profile.titles.join(", ")}
          </h1>

          {/* centered desktop launcher */}
          <div className="term-scroll absolute inset-0 flex items-center justify-center overflow-y-auto px-3 py-5 sm:p-6">
            <div className="flex w-full max-w-4xl flex-col items-center gap-6 sm:gap-8">
              <Hero />




              <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-6">
                {APPS.map((app, i) => (
                  <li key={app.id} className="icon-pop" style={{ animationDelay: `${i * 55}ms` }}>
                    <button
                      type="button"
                      onDoubleClick={() => open(app.id)}
                      onClick={() => open(app.id)}
                      title={`Open ${app.label} (${app.hint})`}
                      aria-label={`Open ${app.label}`}
                      className="group relative flex w-[5.75rem] flex-col items-center gap-2 rounded-xl p-1.5 focus-visible:outline-none sm:w-[6.25rem]"
                    >
                      <span
                        className={cn(
                          "icon-3d icon-sheen icon-bezel relative grid size-[4.25rem] place-items-center rounded-[1.4rem] border-2 border-foreground/70 ring-1 ring-foreground/25 ring-offset-1 ring-offset-background/30 backdrop-blur-xl",
                          "transition-all duration-300 ease-out will-change-transform",
                          "group-hover:-translate-y-2 group-hover:scale-[1.12] group-hover:rotate-[-2deg] group-active:scale-95",
                          "group-hover:border-primary/70 group-hover:glow-primary group-focus-visible:border-primary",
                          "[&_svg]:size-8 [&_svg]:drop-shadow-[0_3px_6px_oklch(0_0_0/0.7)] [&_svg]:stroke-[1.9]",
                          app.tone,
                        )}
                      >
                        {app.icon}
                      </span>

                      <span className="rounded-md bg-background/35 px-1.5 py-0.5 font-sans text-[11.5px] leading-tight font-medium text-foreground/95 backdrop-blur-sm transition-colors group-hover:text-primary">
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
                    title={
                      state.minimized ? `Restore ${app.label}` : `Minimize ${app.label}`
                    }
                    aria-label={
                      state.minimized ? `Restore ${app.label} window` : `Minimize ${app.label} window`
                    }
                    aria-pressed={focused === state.id && !state.minimized}
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

          {picker && (
            <WallpaperPicker
              active={paper}
              onSelect={(i) => setPaper(i)}
              onRandomize={() => setPaper(randomWallpaperIndex())}
              onClose={() => setPicker(false)}
            />
          )}

          <button
            type="button"
            onClick={() => setPicker((v) => !v)}
            title="Choose or randomize the wallpaper"
            aria-label="Choose or randomize the wallpaper"
            aria-expanded={picker}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1.5 font-mono text-[11px] transition-colors [&_svg]:size-4",
              picker
                ? "border-primary/70 bg-primary/15 text-primary"
                : "border-border/60 text-muted-foreground hover:border-primary/60 hover:text-primary",
            )}
          >
            <ImageIcon />
            <span className="hidden sm:inline">wallpaper</span>
          </button>
        </footer>

      </div>
    </div>

  );
}

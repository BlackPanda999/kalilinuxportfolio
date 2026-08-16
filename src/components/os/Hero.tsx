import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

import { profile } from "@/data/profile";

const ROLES = [
  "Ethical Hacker",
  "IT Expert",
  "AI Security Specialist",
  "Network Security Engineer",
  "Cloud Security Expert",
];

/** Typewriter rotator — types a role, holds, deletes, moves to the next. */
function useTypedRole() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[index] ?? "";
    if (!deleting && text === full) {
      const hold = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(hold);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
      return;
    }
    const step = setTimeout(
      () => setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1)),
      deleting ? 45 : 85,
    );
    return () => clearTimeout(step);
  }, [text, deleting, index]);

  return text;
}

export function Hero() {
  const typed = useTypedRole();

  return (
    <div className="text-center">
      <span className="inline-flex items-center gap-2 rounded-full border border-shell/40 bg-shell/10 px-4 py-1.5 font-sans text-[11px] font-semibold tracking-[0.22em] text-shell uppercase backdrop-blur-sm sm:text-xs">
        <Sparkles className="size-3.5" />
        Welcome to my digital universe
      </span>

      <h2 className="mt-5 font-sans text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
        Hi, I&apos;m <span className="text-shell">{profile.name}</span>
      </h2>

      <p className="mt-2 font-sans text-lg text-foreground/80 sm:text-2xl">
        Your Next{" "}
        <span className="font-semibold text-shell">{typed}</span>
        <span className="caret-blink ml-0.5 inline-block w-[2px] translate-y-0.5 self-center bg-shell align-middle text-transparent">
          |
        </span>
      </p>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Cybersecurity &amp; IT professional with 5+ years of experience in penetration testing, cloud
        security, IT infrastructure and AI-powered threat detection. Available for hire across Cyber,
        IT, Cloud and AI Security projects.
      </p>

      <p className="mt-4 font-mono text-[11px] text-muted-foreground">
        double-click an icon to launch · type <span className="text-shell">help</span> in Terminal
      </p>
    </div>
  );
}

import { useEffect, useState } from "react";

import { profile } from "@/data/profile";

const LINES = [
  "GRUB 2.12 — booting PandaOS (kali-rolling) …",
  "[  OK  ] Started Secure Kernel 6.8.0-kali-amd64",
  "[  OK  ] Mounted /dev/portfolio on /home/blackpanda999",
  "[  OK  ] Loaded module: pentest_toolkit (burp, nmap, metasploit)",
  "[  OK  ] Started Elastic SIEM agent — telemetry streaming",
  "[  OK  ] Firewall ruleset applied · WPA3 · MFA enforced",
  "[  OK  ] panda-ai assistant online",
  "[  OK  ] Started Display Manager (pandadm)",
  "[  OK  ] Reached target Graphical Interface",
];

/** Panda / dragon-style distro mark, drawn inline so it needs no asset. */
function PandaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="pandaMark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" />
          <stop offset="100%" stopColor="var(--color-shell)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="29" fill="none" stroke="url(#pandaMark)" strokeWidth="1.4" opacity="0.5" />
      {/* ears */}
      <circle cx="17" cy="18" r="8" fill="url(#pandaMark)" opacity="0.9" />
      <circle cx="47" cy="18" r="8" fill="url(#pandaMark)" opacity="0.9" />
      {/* head */}
      <path
        d="M32 12c11 0 19 8.5 19 19.5S43 51 32 51 13 42.5 13 31.5 21 12 32 12z"
        fill="none"
        stroke="url(#pandaMark)"
        strokeWidth="2.2"
      />
      {/* eyes */}
      <ellipse cx="24" cy="30" rx="4.6" ry="5.6" fill="url(#pandaMark)" />
      <ellipse cx="40" cy="30" rx="4.6" ry="5.6" fill="url(#pandaMark)" />
      <circle cx="24" cy="29.5" r="1.5" fill="var(--color-terminal)" />
      <circle cx="40" cy="29.5" r="1.5" fill="var(--color-terminal)" />
      {/* snout */}
      <path
        d="M27 40.5c1.6 2.4 8 2.4 9.6 0"
        fill="none"
        stroke="url(#pandaMark)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="32" cy="37" r="1.8" fill="url(#pandaMark)" />
    </svg>
  );
}

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<"post" | "logo" | "log">("post");
  const [shown, setShown] = useState(0);

  // BIOS/POST → distro logo splash → systemd log
  useEffect(() => {
    if (phase !== "post") return undefined;
    const next = setTimeout(() => setPhase("logo"), 700);
    return () => clearTimeout(next);
  }, [phase]);

  useEffect(() => {
    if (phase !== "logo") return undefined;
    const next = setTimeout(() => setPhase("log"), 1500);
    return () => clearTimeout(next);
  }, [phase]);

  useEffect(() => {
    if (phase !== "log") return undefined;
    if (shown >= LINES.length) {
      const done = setTimeout(onDone, 620);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setShown((value) => value + 1), shown === 0 ? 240 : 150);
    return () => clearTimeout(next);
  }, [phase, shown, onDone]);

  const pct = phase === "log" ? Math.round((shown / LINES.length) * 100) : 0;

  return (
    <div
      className="scanlines crt-flicker flex h-screen w-full flex-col justify-center px-5 font-mono text-[12px] sm:px-16 sm:text-[13px]"
      style={{ backgroundColor: "var(--color-terminal)" }}
    >
      {phase === "logo" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <PandaLogo className="boot-pulse size-24 sm:size-32" />
          <div>
            <p className="font-sans text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Panda<span className="text-primary">OS</span>
            </p>
            <p className="mt-1 text-[11px] tracking-[0.34em] text-shell uppercase">
              kali rolling · secure edition
            </p>
          </div>
          <span className="boot-ring size-7 rounded-full border-2 border-border border-t-primary" />
          <p className="text-[11px] text-muted-foreground">
            starting {profile.name.toLowerCase().replace(" ", "_")} session …
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <PandaLogo className="size-8 shrink-0 sm:size-10" />
            <p className="text-muted-foreground">
              PandaOS BIOS v9.99 · POST ok · mem 32768MB · secure boot{" "}
              <span className="text-shell">enabled</span>
            </p>
          </div>
          <p className="mt-3 text-shell">
            root@{profile.handle}:~$ <span className="text-foreground">./boot_osama_khan.sh</span>
          </p>
          <ul className="mt-4 space-y-1">
            {LINES.slice(0, shown).map((line) => (
              <li key={line} className="break-words text-muted-foreground">
                <span className="text-shell">{line.slice(0, 8)}</span>
                {line.slice(8)}
              </li>
            ))}
            {shown < LINES.length && (
              <li className="text-primary">
                <span className="caret-blink">█</span>
              </li>
            )}
          </ul>
          <div className="mt-6 flex max-w-md items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-primary">{pct}%</span>
          </div>
          {shown >= LINES.length && (
            <p className="mt-4 text-xs text-shell">
              login: {profile.handle} · session: PandaOS desktop — starting …
            </p>
          )}
        </>
      )}

      <button
        type="button"
        onClick={onDone}
        className="mt-8 min-h-11 w-fit self-start rounded-sm border border-border px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        skip boot →
      </button>
    </div>
  );
}

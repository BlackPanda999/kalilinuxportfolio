import { useEffect, useState } from "react";

import { profile } from "@/data/profile";

/** kernel-style log lines with dmesg timestamps */
const KERNEL = [
  "Linux version 6.12.0-blackpanda-amd64 (gcc 14.2.0) #1 SMP PREEMPT_DYNAMIC",
  "Command line: BOOT_IMAGE=/vmlinuz root=/dev/portfolio ro quiet splash",
  "smpboot: CPU0: AMD Ryzen 9 (family 0x19) — 16 cores online",
  "Memory: 32768MB available / secure boot: enabled / TPM 2.0: ok",
  "EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode",
  "random: crng init done",
];

const SERVICES = [
  "Reached target Basic System.",
  "Started Load Kernel Modules (pentest_toolkit: nmap, burp, metasploit).",
  "Started Network Manager — WPA3 · MFA enforced · VPN tunnel up.",
  "Started Elastic SIEM agent — telemetry streaming.",
  "Started blackpanda-ai assistant daemon.",
  "Started Display Manager (blackpandadm).",
  "Reached target Graphical Interface.",
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
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="url(#pandaMark)"
        strokeWidth="1.4"
        opacity="0.5"
      />
      <circle cx="17" cy="18" r="8" fill="url(#pandaMark)" opacity="0.9" />
      <circle cx="47" cy="18" r="8" fill="url(#pandaMark)" opacity="0.9" />
      <path
        d="M32 12c11 0 19 8.5 19 19.5S43 51 32 51 13 42.5 13 31.5 21 12 32 12z"
        fill="none"
        stroke="url(#pandaMark)"
        strokeWidth="2.2"
      />
      <ellipse cx="24" cy="30" rx="4.6" ry="5.6" fill="url(#pandaMark)" />
      <ellipse cx="40" cy="30" rx="4.6" ry="5.6" fill="url(#pandaMark)" />
      <circle cx="24" cy="29.5" r="1.5" fill="var(--color-terminal)" />
      <circle cx="40" cy="29.5" r="1.5" fill="var(--color-terminal)" />
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

type Phase = "grub" | "kernel" | "services" | "splash";

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("grub");
  const [kernel, setKernel] = useState(0);
  const [svc, setSvc] = useState(0);
  const [countdown, setCountdown] = useState(3);

  // any key / Esc skips straight to the desktop, like a real splash
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") onDone();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onDone]);

  // GRUB menu (3s countdown) → kernel dmesg → systemd services → splash → desktop
  useEffect(() => {
    if (phase !== "grub") return undefined;
    if (countdown <= 0) {
      const t = setTimeout(() => setPhase("kernel"), 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCountdown((n) => n - 1), 620);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  useEffect(() => {
    if (phase !== "kernel") return undefined;
    if (kernel >= KERNEL.length) {
      const t = setTimeout(() => setPhase("services"), 300);
      return () => clearTimeout(t);
    }
    // uneven cadence reads like real kernel output
    const t = setTimeout(() => setKernel((n) => n + 1), 90 + (kernel % 3) * 85);
    return () => clearTimeout(t);
  }, [phase, kernel]);

  useEffect(() => {
    if (phase !== "services") return undefined;
    if (svc >= SERVICES.length) {
      const t = setTimeout(() => setPhase("splash"), 340);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setSvc((n) => n + 1), 120 + (svc % 4) * 70);
    return () => clearTimeout(t);
  }, [phase, svc]);

  useEffect(() => {
    if (phase !== "splash") return undefined;
    const t = setTimeout(onDone, 1500);
    return () => clearTimeout(t);
  }, [phase, onDone]);

  const stamp = (i: number) => `[    ${(0.4821 + i * 0.1734).toFixed(6)}]`;
  const progress = Math.round(
    ((kernel + svc) / (KERNEL.length + SERVICES.length)) * 100,
  );

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Blackpanda Linux is starting up"
      className="scanlines crt-flicker relative flex h-screen w-full flex-col overflow-hidden px-3 py-4 font-mono text-[10.5px] leading-relaxed sm:px-10 sm:py-6 sm:text-[12px] lg:text-[13px]"
      style={{ backgroundColor: "var(--color-terminal)" }}
    >

      {phase === "grub" && (
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center">
          <p className="mb-2 text-center text-muted-foreground">GNU GRUB version 2.12</p>
          <div className="border border-border/80 p-3">
            <p className="bg-primary/85 px-2 py-0.5 text-primary-foreground">
              Blackpanda Linux 2026.09 (kali-rolling)
            </p>
            <p className="px-2 py-0.5 text-muted-foreground">
              Advanced options for Blackpanda Linux
            </p>
            <p className="px-2 py-0.5 text-muted-foreground">Memory test (memtest86+)</p>
            <p className="px-2 py-0.5 text-muted-foreground">UEFI Firmware Settings</p>
          </div>
          <p className="mt-3 text-center text-[10.5px] text-muted-foreground">
            The highlighted entry will be executed automatically in {Math.max(countdown, 0)}s.
          </p>
        </div>
      )}

      {(phase === "kernel" || phase === "services") && (
        <div className="flex min-h-0 flex-1 flex-col">
          <ul className="term-scroll min-h-0 flex-1 space-y-0.5 overflow-y-auto">
            {KERNEL.slice(0, kernel).map((line, i) => (
              <li key={line} className="break-words text-muted-foreground">
                <span className="text-shell-dim">{stamp(i)}</span> {line}
              </li>
            ))}
            {SERVICES.slice(0, svc).map((line) => (
              <li key={line} className="break-words text-muted-foreground">
                <span className="text-shell">[ OK ]</span> {line}
              </li>
            ))}
            <li className="text-primary">
              <span className="caret-blink">█</span>
            </li>
          </ul>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/50">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}


      {phase === "splash" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <PandaLogo className="boot-pulse size-24 sm:size-32" />
          <div>
            <p className="font-sans text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Blackpanda <span className="text-primary">Team</span>
            </p>
            <p className="mt-1 text-[11px] tracking-[0.34em] text-shell uppercase">
              Linux 2026.09 · secure lab edition
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="boot-dot size-2 rounded-full bg-primary"
                style={{ animationDelay: `${i * 130}ms` }}
              />
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground">
            login: {profile.handle} — starting desktop session …
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={onDone}
        title="Skip the boot sequence and go to the desktop"
        aria-label="Skip boot and go to desktop"
        className="mt-4 min-h-11 w-fit self-start rounded-md border border-border bg-background/40 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        skip to desktop → <span className="hidden sm:inline text-shell-dim">(esc)</span>
      </button>

    </div>
  );
}

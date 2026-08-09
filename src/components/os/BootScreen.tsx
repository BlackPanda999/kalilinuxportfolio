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

export function BootScreen({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (shown >= LINES.length) {
      const done = setTimeout(onDone, 620);
      return () => clearTimeout(done);
    }
    const next = setTimeout(() => setShown((value) => value + 1), shown === 0 ? 260 : 165);
    return () => clearTimeout(next);
  }, [shown, onDone]);

  const pct = Math.round((shown / LINES.length) * 100);

  return (
    <div
      className="scanlines flex h-screen w-full flex-col justify-center px-6 font-mono text-[13px] sm:px-16"
      style={{ backgroundColor: "var(--color-terminal)" }}
    >
      <p className="text-muted-foreground">
        PandaOS BIOS v9.99 · POST ok · mem 32768MB · secure boot{" "}
        <span className="text-shell">enabled</span>
      </p>
      <p className="mt-3 text-shell">
        root@{profile.handle}:~$ <span className="text-foreground">./boot_osama_khan.sh</span>
      </p>
      <ul className="mt-4 space-y-1">
        {LINES.slice(0, shown).map((line) => (
          <li key={line} className="text-muted-foreground">
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
      <button
        type="button"
        onClick={onDone}
        className="mt-8 w-fit rounded-sm border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        skip boot →
      </button>
    </div>
  );
}

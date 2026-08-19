import { useEffect, useRef, useState } from "react";

import { certifications, experience, profile, projects, skills } from "@/data/profile";
import { CTF_BANNER, FLAG_ENCODED, HINTS, isFlag, markSolved } from "@/lib/ctf";
import type { AppId } from "../types";

type Line = { kind: "in" | "out"; text: string };

const HELP = [
  "available commands:",
  "  help              show this list",
  "  whoami            short bio",
  "  neofetch          system + profile summary",
  "  ls                list desktop folders",
  "  projects          list practical projects",
  "  certs             list certifications",
  "  experience        list work history",
  "  skills            list toolkit",
  "  contact           contact details",
  "  open <app>        open a window (about, projects, certifications, experience, skills, cv, contact, ai)",
  "  ai <question>     ask the AI assistant about Osama",
  "  ctf               start the 'who am i?' recon puzzle",
  "  clear             clear the screen",
].join("\n");

const NEOFETCH = [
  `${profile.handle}@${profile.host}`,
  "-----------------------------",
  `OS         : PandaOS (Kali-based)`,
  `Host       : ${profile.name}`,
  `Role       : ${profile.titles.join(" / ")}`,
  `Uptime     : 5+ years in IT & security`,
  `Location   : ${profile.location}`,
  `Shell      : bash / python3`,
  `Certs      : ${certifications.reduce((n, g) => n + g.items.length, 0)} credentials`,
  `Projects   : ${projects.length} documented`,
  `Contact    : ${profile.email}`,
].join("\n");

export function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `PandaOS shell — type "help" to list commands.` },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function run(raw: string) {
    const input = raw.trim();
    const next: Line[] = [{ kind: "in", text: input }];
    const [cmd, ...rest] = input.split(/\s+/);
    const arg = rest.join(" ").toLowerCase();

    switch ((cmd ?? "").toLowerCase()) {
      case "":
        break;
      case "help":
        next.push({ kind: "out", text: HELP });
        break;
      case "whoami":
        next.push({ kind: "out", text: profile.summary });
        break;
      case "neofetch":
        next.push({ kind: "out", text: NEOFETCH });
        break;
      case "ls":
        next.push({
          kind: "out",
          text:
            arg === "-la" || arg === "-a" || arg === "-al"
              ? [
                  "total 9",
                  "drwxr-xr-x  blackpanda999  .",
                  "drwxr-xr-x  root           ..",
                  "-r--------  blackpanda999  .flag        <- interesting",
                  "-rw-r--r--  blackpanda999  about_me.txt",
                  "drwxr-xr-x  blackpanda999  projects/",
                  "drwxr-xr-x  blackpanda999  certifications/",
                  "-rw-r--r--  blackpanda999  experience.log",
                  "drwxr-xr-x  blackpanda999  skills/",
                  "drwxr-xr-x  blackpanda999  cv/",
                  "-rw-r--r--  blackpanda999  contact.conf",
                ].join("\n")
              : "about_me.txt  projects/  certifications/  experience.log  skills/  cv/  contact.conf  panda-ai",
        });
        break;
      case "ctf":
        next.push({ kind: "out", text: CTF_BANNER });
        break;
      case "hint":
        next.push({ kind: "out", text: HINTS.join("\n") });
        break;
      case "cat":
        if (arg === ".flag" || arg === "flag") {
          next.push({
            kind: "out",
            text: "cat: .flag: binary file — try `hexdump .flag`",
          });
        } else if (arg === "contact.conf") {
          next.push({ kind: "out", text: `email = ${profile.email}\nphone = ${profile.phone}` });
        } else if (arg === "about_me.txt") {
          next.push({ kind: "out", text: profile.summary });
        } else {
          next.push({ kind: "out", text: `cat: ${arg || "missing operand"}: no such file` });
        }
        break;
      case "hexdump":
      case "xxd":
        if (arg === ".flag" || arg === "flag") {
          next.push({
            kind: "out",
            text: `00000000  base64: ${FLAG_ENCODED}\n// decode it, then run: submit <flag>`,
          });
        } else {
          next.push({ kind: "out", text: `hexdump: ${arg || "missing operand"}: no such file` });
        }
        break;
      case "submit":
        if (isFlag(rest.join(" "))) {
          markSolved();
          next.push({
            kind: "out",
            text: [
              "",
              "  ██  flag accepted — nice recon, hacker.  ██",
              "",
              `you found out who I am: ${profile.name}.`,
              "hire me before someone else does: type `open contact`.",
              "",
            ].join("\n"),
          });
        } else {
          next.push({ kind: "out", text: "submit: wrong flag. format is PANDA{...} — type `hint`." });
        }
        break;
      case "sudo":
        next.push({
          kind: "out",
          text: `${profile.handle} is not in the sudoers file. This incident has been logged. :)`,
        });
        break;
      case "projects":
        next.push({
          kind: "out",
          text: projects.map((p) => `- ${p.name} :: ${p.summary}`).join("\n"),
        });
        break;
      case "certs":
      case "certifications":
        next.push({
          kind: "out",
          text: certifications.map((g) => `[${g.group}]\n  ${g.items.join("\n  ")}`).join("\n"),
        });
        break;
      case "experience":
        next.push({
          kind: "out",
          text: experience.map((j) => `- ${j.role} @ ${j.company} (${j.period})`).join("\n"),
        });
        break;
      case "skills":
        next.push({
          kind: "out",
          text: skills.map((g) => `${g.group}: ${g.items.join(", ")}`).join("\n"),
        });
        break;
      case "contact":
        next.push({
          kind: "out",
          text: `email    ${profile.email}\nphone    ${profile.phone}\nlinkedin ${profile.linkedin}\nwebsite  ${profile.website}\nlocation ${profile.location}`,
        });
        break;
      case "open": {
        const valid: AppId[] = [
          "about",
          "projects",
          "certifications",
          "experience",
          "skills",
          "cv",
          "contact",
          "ai",
        ];
        if (valid.includes(arg as AppId)) {
          onOpen(arg as AppId);
          next.push({ kind: "out", text: `opening ${arg}...` });
        } else {
          next.push({ kind: "out", text: `open: unknown app "${arg}". try: ${valid.join(", ")}` });
        }
        break;
      }
      case "ai":
        onOpen("ai");
        next.push({ kind: "out", text: "launching panda-ai — ask your question in that window." });
        break;
      case "clear":
        setLines([]);
        return;
      default:
        next.push({ kind: "out", text: `${cmd}: command not found. type "help".` });
    }

    setLines((prev) => [...prev, ...next]);
    if (input) setHistory((prev) => [input, ...prev]);
    setHistoryIndex(-1);
  }

  return (
    <div
      className="scanlines flex h-full min-h-0 flex-col font-mono text-[13px]"
      style={{ backgroundColor: "var(--color-terminal)" }}
      onClick={(event) => {
        const input = event.currentTarget.querySelector("input");
        input?.focus();
      }}
    >
      <div className="term-scroll min-h-0 flex-1 overflow-auto p-4">
        {lines.map((line, index) => (
          <pre key={index} className="whitespace-pre-wrap break-words">
            {line.kind === "in" ? (
              <>
                <span className="text-shell">
                  {profile.handle}@{profile.host}
                </span>
                <span className="text-muted-foreground">:~$ </span>
                <span className="text-foreground">{line.text}</span>
              </>
            ) : (
              <span className="text-foreground/75">{line.text}</span>
            )}
          </pre>
        ))}
        <div ref={endRef} />
      </div>
      <form
        className="flex items-center gap-2 border-t border-border/50 px-4 py-2.5"
        onSubmit={(event) => {
          event.preventDefault();
          run(value);
          setValue("");
        }}
      >
        <span className="text-shell">
          {profile.handle}@{profile.host}
          <span className="text-muted-foreground">:~$</span>
        </span>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              const index = Math.min(historyIndex + 1, history.length - 1);
              if (index >= 0) {
                setHistoryIndex(index);
                setValue(history[index] ?? "");
              }
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              const index = historyIndex - 1;
              setHistoryIndex(index);
              setValue(index >= 0 ? (history[index] ?? "") : "");
            }
          }}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal input"
          className="flex-1 bg-transparent text-foreground outline-none"
        />
      </form>

    </div>
  );
}

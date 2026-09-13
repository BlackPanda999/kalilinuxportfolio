import { useEffect, useRef, useState } from "react";

import { certifications, experience, profile, projects, skills } from "@/data/profile";
import { CTF_BANNER, FLAG_ENCODED, HINTS, isFlag, markSolved } from "@/lib/ctf";
import type { AppId } from "../types";

type Line = { kind: "in" | "out" | "error" | "system"; text: string; prompt?: string };

const HELP = [
  "BLACKPANDA LINUX LAB — safe commands",
  "",
  "  help                 list commands",
  "  man <command>        open a short manual page",
  "  pwd · ls [-la]       inspect the demo filesystem",
  "  cd <path>            change demo directory",
  "  cat/head/tail <file> read a demo file",
  "  tree                  show the directory tree",
  "  whoami · id          inspect the demo user",
  "  uname [-a]           system information",
  "  hostname · date      host and current time",
  "  ip addr · ping HOST  simulated network tools",
  "  ps · top · free · df simulated system status",
  "  echo <text>           print text",
  "  history               command history",
  "  learn [topic]         Linux mini-lessons",
  "  quiz                  quick Linux challenge",
  "  ctf · hint            start the portfolio CTF",
  "  open <app>            open a portfolio window",
  "  clear                 clear terminal output",
  "",
  "Tip: try `ls -la`, `cat README.md`, `learn permissions`, or `ctf`.",
].join("\n");

const FILES: Record<string, string> = {
  "/home/blackpanda999/README.md": [
    "# Blackpanda Linux Practice Lab",
    "",
    "This terminal is a safe simulation. It cannot access your device.",
    "Use `help` for commands, `learn` for lessons, or `ctf` for a challenge.",
  ].join("\n"),
  "/home/blackpanda999/about_me.txt": profile.summary,
  "/home/blackpanda999/projects/security-lab.txt": [
    "Elastic SIEM Home Lab",
    "status: online",
    "telemetry: Kali endpoint → Elastic Agent → SIEM",
    "detections: port scan, failed login burst, suspicious process",
  ].join("\n"),
  "/home/blackpanda999/notes/linux-basics.txt": [
    "pwd       show current directory",
    "ls -la    include hidden files and permissions",
    "cd ..     move to the parent directory",
    "cat FILE  print a text file",
    "man CMD   read command help",
  ].join("\n"),
  "/home/blackpanda999/notes/security-rules.txt": [
    "1. Only test systems you own or have written permission to test.",
    "2. Define scope before testing.",
    "3. Protect evidence and report responsibly.",
    "4. Use isolated labs for practice.",
  ].join("\n"),
  "/var/log/auth.log": [
    "Sep 13 08:42:11 kali sshd[902]: Accepted publickey for blackpanda999",
    "Sep 13 08:44:02 kali sudo[1017]: authentication failure (training event)",
    "Sep 13 08:44:14 kali audit[1042]: lab policy blocked unsafe operation",
  ].join("\n"),
};

const DIRECTORIES = [
  "/",
  "/home",
  "/home/blackpanda999",
  "/home/blackpanda999/projects",
  "/home/blackpanda999/notes",
  "/var",
  "/var/log",
];

const LESSONS: Record<string, string> = {
  basics: "Linux basics\n1. `pwd` locates you.\n2. `ls -la` inspects files and permissions.\n3. `cd PATH` moves around.\n4. `cat FILE` reads text.\nPractice: pwd && ls -la && cat README.md",
  permissions: "Permissions use read (r), write (w), execute (x) for owner, group and others.\nExample: -rw-r--r-- means owner can read/write; everyone else can read.\nReal tools: chmod changes modes; chown changes ownership. This lab is read-only.",
  networking: "Start with: ip addr, ping HOST, ss -tuln, and DNS concepts.\nPorts identify services; protocols define communication.\nOnly scan systems you own or are explicitly authorised to test.",
  security: "A safe workflow: define scope → inventory → assess → validate → report → remediate.\nUse the Cyber Security app for the complete zero-to-hero roadmap.",
};

const MANUALS: Record<string, string> = {
  ls: "LS(1) — list directory contents\nUsage: ls [-l] [-a] [PATH]\n-a includes hidden entries; -l uses long format.",
  cd: "CD — change working directory\nUsage: cd [PATH]\nUse `cd ..` for parent and `cd ~` for home.",
  cat: "CAT(1) — concatenate and print files\nUsage: cat FILE\nThis lab exposes demo text files only.",
  pwd: "PWD(1) — print the current working directory.",
  grep: "GREP(1) — search text patterns\nIn a real shell: grep PATTERN FILE\nTry reading notes first with `cat notes/linux-basics.txt`.",
  chmod: "CHMOD(1) — change file mode bits\nExample: chmod 640 report.txt\nDisabled here because this training filesystem is read-only.",
  sudo: "SUDO(8) — execute a command as another user\nDisabled in this browser-based lab.",
};

const APPS: AppId[] = [
  "about", "projects", "certifications", "experience", "skills", "cv", "cyber", "contact", "ai",
];

function normalizePath(cwd: string, input?: string) {
  if (!input || input === "~") return "/home/blackpanda999";
  const source = input.startsWith("/") ? input : `${cwd}/${input}`;
  const parts: string[] = [];
  for (const part of source.split("/")) {
    if (!part || part === ".") continue;
    if (part === "..") parts.pop();
    else parts.push(part);
  }
  return `/${parts.join("/")}`;
}

function shortPath(path: string) {
  return path.replace("/home/blackpanda999", "~") || "/";
}

function listDirectory(path: string, all: boolean, long: boolean) {
  const prefix = path === "/" ? "/" : `${path}/`;
  const names = new Map<string, "dir" | "file">();
  for (const directory of DIRECTORIES) {
    if (!directory.startsWith(prefix) || directory === path) continue;
    const rest = directory.slice(prefix.length);
    if (rest && !rest.includes("/")) names.set(rest, "dir");
  }
  for (const file of Object.keys(FILES)) {
    if (!file.startsWith(prefix)) continue;
    const rest = file.slice(prefix.length);
    if (rest && !rest.includes("/")) names.set(rest, "file");
  }
  if (path === "/home/blackpanda999") names.set(".flag", "file");
  const rows = [...names.entries()].filter(([name]) => all || !name.startsWith("."));
  if (!rows.length) return "";
  return rows
    .map(([name, type]) => long
      ? `${type === "dir" ? "drwxr-xr-x" : "-rw-r--r--"}  blackpanda  blackpanda  ${type === "dir" ? "4096" : "1024"}  ${name}${type === "dir" ? "/" : ""}`
      : `${name}${type === "dir" ? "/" : ""}`)
    .join(long ? "\n" : "  ");
}

export function TerminalApp({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "system", text: "Blackpanda Linux 2026.09 · safe training shell" },
    { kind: "out", text: "Type `help` to explore, `learn` to practise, or `ctf` for the challenge." },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cwd, setCwd] = useState("/home/blackpanda999");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [lines]);

  function execute(command: string, workingDirectory: string): { output: Line[]; cwd: string } {
    const tokens = command.trim().split(/\s+/);
    const cmd = (tokens.shift() ?? "").toLowerCase();
    const args = tokens;
    const arg = args.join(" ");
    const output: Line[] = [];
    let nextCwd = workingDirectory;
    const out = (text: string, kind: Line["kind"] = "out") => output.push({ kind, text });

    switch (cmd) {
      case "": break;
      case "help": out(HELP); break;
      case "pwd": out(workingDirectory); break;
      case "whoami": out(profile.handle); break;
      case "id": out(`uid=1000(${profile.handle}) gid=1000(${profile.handle}) groups=1000(${profile.handle}),27(sudo),1001(cyberlab)`); break;
      case "hostname": out(profile.host); break;
      case "date": out(new Date().toString()); break;
      case "uname": out(args.includes("-a") ? "Linux kali 6.12.0-blackpanda-amd64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux" : "Linux"); break;
      case "clear": return { output: [], cwd: workingDirectory };
      case "echo": out(arg); break;
      case "history": out(history.slice().reverse().map((item, index) => `${String(index + 1).padStart(4)}  ${item}`).join("\n")); break;
      case "ls": {
        const flags = args.filter((item) => item.startsWith("-")).join("");
        const targetArg = args.find((item) => !item.startsWith("-"));
        const target = normalizePath(workingDirectory, targetArg ?? ".");
        if (!DIRECTORIES.includes(target)) out(`ls: cannot access '${targetArg ?? target}': No such directory`, "error");
        else out(listDirectory(target, flags.includes("a"), flags.includes("l")));
        break;
      }
      case "cd": {
        const target = normalizePath(workingDirectory, args[0]);
        if (DIRECTORIES.includes(target)) nextCwd = target;
        else out(`cd: ${args[0] ?? ""}: No such file or directory`, "error");
        break;
      }
      case "cat":
      case "head":
      case "tail": {
        const target = normalizePath(workingDirectory, args[0]);
        if (target === "/home/blackpanda999/.flag") {
          out("cat: .flag: binary file — inspect it with `hexdump .flag`");
          break;
        }
        const file = FILES[target];
        if (!file) out(`${cmd}: ${args[0] ?? "missing operand"}: No such file`, "error");
        else {
          const fileLines = file.split("\n");
          out(cmd === "head" ? fileLines.slice(0, 5).join("\n") : cmd === "tail" ? fileLines.slice(-5).join("\n") : file);
        }
        break;
      }
      case "tree": out(".\n├── README.md\n├── about_me.txt\n├── notes/\n│   ├── linux-basics.txt\n│   └── security-rules.txt\n└── projects/\n    └── security-lab.txt\n\n2 directories, 5 files"); break;
      case "free": out("               total        used        free      shared  buff/cache   available\nMem:            31Gi       6.4Gi        19Gi       512Mi       5.6Gi        24Gi\nSwap:          2.0Gi          0B       2.0Gi"); break;
      case "df": out("Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p2  220G   58G  151G  28% /\ntmpfs            16G  1.2M   16G   1% /run/user/1000"); break;
      case "ps": out("    PID TTY          TIME CMD\n   1092 pts/0    00:00:00 zsh\n   1147 pts/0    00:00:00 panda-ai\n   1204 pts/0    00:00:00 ps"); break;
      case "top": out("top - 08:49:12 up 2:06, 1 user, load average: 0.07, 0.12, 0.09\nTasks: 148 total, 1 running, 147 sleeping\n%Cpu(s): 3.1 us, 1.2 sy, 95.7 id\nMiB Mem: 32768 total, 19644 free, 6554 used, 6570 buff/cache"); break;
      case "ip": out(arg === "addr" || arg === "a" ? "1: lo: <LOOPBACK,UP> mtu 65536\n    inet 127.0.0.1/8 scope host lo\n2: eth0: <BROADCAST,MULTICAST,UP> mtu 1500\n    inet 10.10.20.26/24 scope global dynamic eth0" : "Usage: ip addr"); break;
      case "ping": out(args[0] ? `PING ${args[0]} (10.10.20.1): 56 data bytes\n64 bytes: icmp_seq=1 ttl=64 time=8.42 ms\n64 bytes: icmp_seq=2 ttl=64 time=7.91 ms\n--- ${args[0]} ping statistics ---\n2 packets transmitted, 2 received, 0% packet loss` : "ping: usage error: Destination address required", args[0] ? "out" : "error"); break;
      case "man": out(MANUALS[args[0] ?? ""] ?? `No manual entry for ${args[0] ?? "nothing"}`, MANUALS[args[0] ?? ""] ? "out" : "error"); break;
      case "learn": {
        if (!args[0]) out("Available lessons: basics, permissions, networking, security\nRun: learn <topic>");
        else out(LESSONS[args[0]] ?? `Unknown lesson '${args[0]}'. Try: ${Object.keys(LESSONS).join(", ")}`, LESSONS[args[0]] ? "out" : "error");
        break;
      }
      case "quiz": out("LINUX QUICK CHECK\nWhich command lists hidden files in long format?\nA) pwd   B) ls -la   C) cat -h\n\nExplore the shell to verify your answer."); break;
      case "neofetch": out(`${profile.handle}@${profile.host}\n-----------------------------\nOS: Blackpanda Linux 2026.09\nHost: ${profile.name}\nRole: ${profile.titles.join(" / ")}\nShell: zsh 5.9\nTerminal: Blackpanda WebTTY\nSecurity labs: active`); break;
      case "projects": out(projects.map((item) => `- ${item.name} :: ${item.summary}`).join("\n")); break;
      case "certs":
      case "certifications": out(certifications.map((group) => `[${group.group}]\n  ${group.items.join("\n  ")}`).join("\n")); break;
      case "experience": out(experience.map((job) => `- ${job.role} @ ${job.company} (${job.period})`).join("\n")); break;
      case "skills": out(skills.map((group) => `${group.group}: ${group.items.join(", ")}`).join("\n")); break;
      case "ctf": out(CTF_BANNER, "system"); break;
      case "hint": out(HINTS.join("\n")); break;
      case "hexdump":
      case "xxd": out(args[0] === ".flag" ? `00000000  base64: ${FLAG_ENCODED}\n// decode it, then run: submit <flag>` : `${cmd}: ${args[0] ?? "missing operand"}: No such file`, args[0] === ".flag" ? "out" : "error"); break;
      case "submit":
        if (isFlag(arg)) {
          markSolved();
          out(`FLAG ACCEPTED — excellent recon.\nYou found ${profile.name}. Type \`open contact\` to connect.`, "system");
        } else out("submit: wrong flag. Format: PANDA{...}. Type `hint`.", "error");
        break;
      case "open": {
        const app = args[0] as AppId;
        if (APPS.includes(app)) {
          onOpen(app);
          out(`opening ${app}...`);
        } else out(`open: unknown app '${args[0] ?? ""}'. Try: ${APPS.join(", ")}`, "error");
        break;
      }
      case "ai": onOpen("ai"); out("panda-ai opened — ask about Linux, cybersecurity, or Osama's portfolio."); break;
      case "sudo":
      case "rm":
      case "chmod":
      case "chown":
      case "apt": out(`${cmd}: disabled in this safe, read-only training lab. Try \`man ${cmd}\`.`, "error"); break;
      default: out(`${cmd}: command not found. Type \`help\` or \`man <command>\`.`, "error");
    }
    return { output, cwd: nextCwd };
  }

  function run(raw: string) {
    const input = raw.trim();
    if (!input) return;
    const prompt = `${profile.handle}@${profile.host}:${shortPath(cwd)}$`;
    if (input === "clear") {
      setLines([]);
      setHistory((previous) => [input, ...previous]);
      setHistoryIndex(-1);
      return;
    }
    let activeCwd = cwd;
    const commandOutput: Line[] = [];
    for (const command of input.split(/\s*&&\s*/)) {
      const result = execute(command, activeCwd);
      activeCwd = result.cwd;
      commandOutput.push(...result.output);
      if (result.output.some((line) => line.kind === "error")) break;
    }
    setCwd(activeCwd);
    setLines((previous) => [...previous, { kind: "in", text: input, prompt }, ...commandOutput]);
    setHistory((previous) => [input, ...previous].slice(0, 50));
    setHistoryIndex(-1);
  }

  return (
    <div className="scanlines flex h-full min-h-0 flex-col bg-terminal font-mono text-[12px] sm:text-[13px]" onClick={(event) => event.currentTarget.querySelector("input")?.focus()}>
      <div className="flex items-center gap-2 border-b border-border/50 bg-background/35 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="size-1.5 rounded-full bg-shell shadow-[0_0_7px_var(--color-shell)]" />
        <span>safe lab</span><span>·</span><span>read-only filesystem</span><span className="ml-auto hidden sm:inline">zsh · UTF-8</span>
      </div>
      <div className="term-scroll min-h-0 flex-1 overflow-auto p-3 leading-relaxed sm:p-4">
        {lines.map((line, index) => (
          <pre key={`${index}-${line.text.slice(0, 12)}`} className="mb-1 whitespace-pre-wrap break-words">
            {line.kind === "in" ? <><span className="text-shell">{line.prompt}</span> <span className="text-foreground">{line.text}</span></> : <span className={line.kind === "error" ? "text-destructive" : line.kind === "system" ? "text-primary text-glow" : "text-foreground/78"}>{line.text}</span>}
          </pre>
        ))}
        <div ref={endRef} />
      </div>
      <form className="flex min-h-12 items-center gap-2 border-t border-border/50 bg-background/20 px-3 py-2.5 sm:px-4" onSubmit={(event) => { event.preventDefault(); run(value); setValue(""); }}>
        <label htmlFor="terminal-command" className="shrink-0 text-shell">{profile.handle}@{profile.host}:<span className="text-primary">{shortPath(cwd)}</span>$</label>
        <input id="terminal-command" value={value} onChange={(event) => setValue(event.target.value)} onKeyDown={(event) => {
          if (event.key === "ArrowUp") { event.preventDefault(); const index = Math.min(historyIndex + 1, history.length - 1); if (index >= 0) { setHistoryIndex(index); setValue(history[index] ?? ""); } }
          if (event.key === "ArrowDown") { event.preventDefault(); const index = historyIndex - 1; setHistoryIndex(index); setValue(index >= 0 ? (history[index] ?? "") : ""); }
        }} spellCheck={false} autoComplete="off" autoFocus aria-label="Linux practice command" className="min-w-0 flex-1 bg-transparent text-foreground caret-primary outline-none" />
      </form>
    </div>
  );
}
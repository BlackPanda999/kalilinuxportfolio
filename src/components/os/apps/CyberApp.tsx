import { BookOpen, ExternalLink, Flag, GraduationCap, Shield } from "lucide-react";

import { Card, Chip, CmdLine, Pane, PageHeader, PathBar, SectionTitle, Stat } from "./ui";

type Stage = {
  phase: string;
  title: string;
  time: string;
  goal: string;
  learn: string[];
  practice: string[];
  certs?: string[];
};

const stages: Stage[] = [
  {
    phase: "00",
    title: "Computer & IT foundations",
    time: "4–8 weeks",
    goal: "Understand how computers, operating systems and the internet actually work before trying to break anything.",
    learn: [
      "Hardware, virtualisation (VirtualBox / VMware) and building a safe home lab",
      "Windows and Linux basics: file systems, users, permissions, services",
      "Command line: bash, PowerShell, package managers, SSH",
      "How the web works: HTTP, DNS, cookies, sessions, TLS",
    ],
    practice: [
      "Install Kali Linux and a Windows VM in an isolated lab network",
      "Complete a beginner Linux path (e.g. TryHackMe Pre Security)",
    ],
    certs: ["CompTIA ITF+", "Google IT Support Professional Certificate"],
  },
  {
    phase: "01",
    title: "Networking",
    time: "4–6 weeks",
    goal: "Read traffic, understand routing and know where security controls sit in a network.",
    learn: [
      "OSI / TCP-IP models, subnetting, NAT, VLANs, routing and switching",
      "Core protocols: TCP, UDP, ICMP, ARP, DHCP, DNS, HTTP(S), SMB",
      "Firewalls, proxies, VPNs, IDS/IPS and network segmentation",
      "Packet analysis with Wireshark and tcpdump",
    ],
    practice: [
      "Build a small routed lab in Cisco Packet Tracer or GNS3",
      "Capture and explain a full TCP handshake and a DNS lookup",
    ],
    certs: ["CompTIA Network+", "Cisco CCNA"],
  },
  {
    phase: "02",
    title: "Security fundamentals",
    time: "6–8 weeks",
    goal: "Learn the language of security: risk, controls, cryptography and defence in depth.",
    learn: [
      "CIA triad, threat modelling, risk management, security policies",
      "Cryptography: hashing, symmetric/asymmetric, PKI, certificates",
      "Identity and access management, MFA, least privilege, Active Directory",
      "Endpoint protection, patching, logging, backups and hardening baselines",
    ],
    practice: [
      "Harden a Windows and a Linux VM using CIS Benchmarks",
      "Map a small business to the NIST Cybersecurity Framework",
    ],
    certs: ["CompTIA Security+", "ISC2 Certified in Cybersecurity (CC)"],
  },
  {
    phase: "03",
    title: "Scripting & automation",
    time: "ongoing",
    goal: "Automate the boring parts — every strong security engineer writes code.",
    learn: [
      "Python: requests, sockets, file parsing, argparse, virtual environments",
      "Bash scripting for enumeration and log processing",
      "Git and version control; reading other people's code",
      "APIs, JSON and basic SQL",
    ],
    practice: [
      "Write your own port scanner, subdomain finder and log parser",
      "Automate a recurring lab task end to end",
    ],
  },
  {
    phase: "04",
    title: "Offensive security — ethical hacking",
    time: "3–6 months",
    goal: "Learn the attacker mindset: recon, exploitation, privilege escalation and reporting.",
    learn: [
      "Methodology: recon → scanning → exploitation → post-exploitation → reporting",
      "Web attacks: OWASP Top 10, SQL injection, XSS, SSRF, IDOR, auth flaws",
      "Network attacks: service exploitation, SMB, relaying, pivoting",
      "Privilege escalation on Linux and Windows; Active Directory attacks",
      "Tooling: Nmap, Burp Suite, Metasploit, sqlmap, ffuf, BloodHound, Hydra",
    ],
    practice: [
      "TryHackMe and Hack The Box paths; aim for 50+ machines",
      "PortSwigger Web Security Academy — all free labs",
      "Write a professional report for every box you own",
    ],
    certs: ["eJPT", "CompTIA PenTest+", "PNPT (TCM Security)", "OSCP"],
  },
  {
    phase: "05",
    title: "Defensive security — blue team",
    time: "2–4 months",
    goal: "Detect, investigate and contain attacks — most jobs are on this side.",
    learn: [
      "SOC workflow, alert triage, escalation and incident response lifecycle",
      "SIEM: Splunk, Elastic, Wazuh, Microsoft Sentinel; writing detections",
      "Log sources: Sysmon, Windows Event Logs, firewall, EDR, cloud audit logs",
      "Threat intelligence, MITRE ATT&CK mapping, digital forensics basics",
    ],
    practice: [
      "Build an Elastic or Wazuh SIEM lab and generate real attack telemetry",
      "Blue Team Labs Online, LetsDefend, CyberDefenders exercises",
    ],
    certs: ["Microsoft SC-200", "Splunk Core Certified User", "BTL1"],
  },
  {
    phase: "06",
    title: "Cloud & DevSecOps",
    time: "2–3 months",
    goal: "Secure the environments where modern workloads actually run.",
    learn: [
      "AWS / Azure / GCP fundamentals: IAM, networking, storage, logging",
      "Cloud misconfiguration, privilege escalation paths and CSPM tooling",
      "Containers and Kubernetes security; image scanning and secrets management",
      "CI/CD security, infrastructure as code (Terraform) and SAST/DAST in pipelines",
    ],
    practice: [
      "Harden a free-tier cloud account: MFA, least-privilege IAM, KMS, CloudTrail",
      "Work through flaws.cloud and CloudGoat scenarios",
    ],
    certs: ["AWS Certified Security – Specialty", "Microsoft AZ-500"],
  },
  {
    phase: "07",
    title: "Specialise & go professional",
    time: "continuous",
    goal: "Pick a lane, build proof of work and get hired.",
    learn: [
      "Choose a track: pen testing, red team, SOC/DFIR, cloud security, AppSec, GRC, AI security",
      "Report writing and communicating risk to non-technical stakeholders",
      "Bug bounty rules of engagement and responsible disclosure",
      "Compliance frameworks: ISO 27001, PCI DSS, GDPR, SAMA / NCA (KSA)",
    ],
    practice: [
      "Publish write-ups, a GitHub portfolio and a CTF track record",
      "Join CTF teams, hackathons and local security communities",
      "Apply for SOC analyst, junior pen tester or IT security roles",
    ],
    certs: ["OSCP / OSWE", "CISSP (5 years experience)", "CISM / CRISC (management)"],
  },
];

const resources: { name: string; note: string; href: string }[] = [
  { name: "TryHackMe", note: "Guided beginner-to-advanced hands-on rooms", href: "https://tryhackme.com" },
  { name: "Hack The Box", note: "Realistic machines, Academy modules", href: "https://www.hackthebox.com" },
  { name: "PortSwigger Web Security Academy", note: "Best free web hacking labs", href: "https://portswigger.net/web-security" },
  { name: "OverTheWire", note: "Linux and bandit wargames", href: "https://overthewire.org/wargames/" },
  { name: "MITRE ATT&CK", note: "Attacker techniques knowledge base", href: "https://attack.mitre.org" },
  { name: "OWASP", note: "Top 10, testing guide, cheat sheets", href: "https://owasp.org" },
  { name: "LetsDefend", note: "SOC analyst simulation", href: "https://letsdefend.io" },
  { name: "NIST CSF", note: "Framework used by real organisations", href: "https://www.nist.gov/cyberframework" },
  { name: "Professor Messer", note: "Free Security+ / Network+ video courses", href: "https://www.professormesser.com" },
  { name: "CyberDefenders", note: "Blue team forensics challenges", href: "https://cyberdefenders.org" },
];

const rules = [
  "Only test systems you own or have written permission to test.",
  "Read the scope and rules of engagement before every assessment.",
  "Never store client data outside agreed, encrypted locations.",
  "Report findings responsibly — no public disclosure without consent.",
];

export function CyberApp() {
  return (
    <div className="flex min-h-full flex-col">
      <PathBar path="/opt/cyber-security/roadmap.md" />
      <Pane className="flex-1 space-y-8">
        <PageHeader
          kicker="learn cyber security"
          title="Zero to hero roadmap"
          intro="A complete, self-study path from absolute beginner to employable security professional — the same order I recommend to people starting out. Free resources, hands-on labs and the certifications that actually matter."
          meta={[
            <Chip key="a">8 phases</Chip>,
            <Chip key="b">12–18 months part-time</Chip>,
            <Chip key="c">free resources</Chip>,
            <Chip key="d">hands-on first</Chip>,
          ]}
        />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          <Stat value="8" label="Learning phases" />
          <Stat value="10" label="Free platforms" />
          <Stat value="20+" label="Certification paths" />
          <Stat value="100%" label="Lab-based" />
        </div>

        <section>
          <SectionTitle index={1}>How to use this roadmap</SectionTitle>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            <CmdLine>Work top to bottom — skipping foundations is why most people stall.</CmdLine>
            <CmdLine>Spend 70% of your time in a lab, 30% reading or watching.</CmdLine>
            <CmdLine>Document everything: notes, write-ups and screenshots become your portfolio.</CmdLine>
            <CmdLine>Certifications prove knowledge; projects and labs prove skill. Do both.</CmdLine>
          </ul>
        </section>

        <section>
          <SectionTitle index={2}>The path</SectionTitle>
          <ol className="space-y-4">
            {stages.map((stage) => (
              <li key={stage.phase}>
                <Card className="p-5">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-shell">
                      phase {stage.phase}
                    </span>
                    <h4 className="font-sans text-lg font-bold tracking-tight text-foreground">
                      {stage.title}
                    </h4>
                    <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
                      {stage.time}
                    </span>
                  </div>
                  <p className="mt-2 max-w-3xl text-[14.5px] leading-[1.8] text-foreground/80">
                    {stage.goal}
                  </p>

                  <div className="mt-4 grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-primary uppercase">
                        <BookOpen className="size-3.5" /> study
                      </p>
                      <ul className="space-y-1.5 text-[13.5px] leading-relaxed text-foreground/80">
                        {stage.learn.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-primary/70">›</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-shell uppercase">
                        <Flag className="size-3.5" /> practice
                      </p>
                      <ul className="space-y-1.5 text-[13.5px] leading-relaxed text-foreground/80">
                        {stage.practice.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-shell/70">$</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      {stage.certs && (
                        <div className="mt-3">
                          <p className="mb-1.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] text-warn uppercase">
                            <GraduationCap className="size-3.5" /> certifications
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.certs.map((cert) => (
                              <Chip key={cert}>{cert}</Chip>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <SectionTitle index={3}>Free training platforms</SectionTitle>
          <ul className="grid gap-2.5 sm:grid-cols-2">
            {resources.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/50 text-primary transition-colors group-hover:border-primary/50">
                    <ExternalLink className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-foreground/90 group-hover:text-primary">
                      {item.name}
                    </span>
                    <span className="block truncate font-mono text-[10.5px] text-muted-foreground">
                      {item.note}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle index={4}>Ethics &amp; the law</SectionTitle>
          <div className="rounded-xl border border-warn/30 bg-warn/5 p-5">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-warn uppercase">
              <Shield className="size-3.5" /> read this first
            </p>
            <ul className="mt-3 space-y-1.5 text-[13.5px] leading-relaxed text-foreground/85">
              {rules.map((rule) => (
                <li key={rule} className="flex gap-2">
                  <span className="text-warn/80">!</span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </Pane>
    </div>
  );
}

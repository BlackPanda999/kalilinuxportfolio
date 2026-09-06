import cvCyber from "@/assets/cv-cyber.pdf.asset.json";
import cvIt from "@/assets/cv-it.pdf.asset.json";

export const profile = {
  name: "Osama Khan",
  handle: "blackpanda999",
  host: "kali",
  titles: ["Cyber Security Specialist", "IT Specialist", "AI Integration Consultant"],
  linkedin: "https://www.linkedin.com/in/osamakhan44",
  website: "https://blackpanda999.base44.app/",
  availability: "Iqama Transferable · Valid Saudi Driving License · Available to join immediately",
  summary:
    "Cybersecurity professional with 5+ years of hands-on experience in ethical hacking, penetration testing, vulnerability analysis, network security and cloud security — combined with deep IT infrastructure and system administration skills. I detect and mitigate threats, harden systems and networks, and help IT companies integrate AI into their operations securely.",
  highlights: [
    "Ethical hacking, penetration testing and vulnerability assessment",
    "Threat detection, incident response, firewall and endpoint security",
    "Cloud security across AWS and Google Cloud (IAM, MFA, KMS, NACLs)",
    "SIEM engineering with Splunk, Wazuh and Elastic",
    "Scripting and automation in Python and Bash",
    "AI/LLM API integration and security testing of AI environments",
    "Translating technical findings into executive-level language",
  ],
  languages: [
    { name: "English", level: "Professional (6 months certificate)" },
    { name: "Arabic", level: "Conversational" },
    { name: "Urdu", level: "Native" },
  ],
  education: [
    { school: "University of Agriculture Peshawar", field: "Computer Science", year: "2024" },
    { school: "Post Graduate College Dargai", field: "Biology", year: "2019" },
    { school: "Allama Iqbal Model School", field: "Science", year: "2016" },
  ],
} as const;

export type Experience = {
  role: string;
  company: string;
  period: string;
  points: string[];
};

export const experience: Experience[] = [
  {
    role: "IT Innovation & Solutions Consultant",
    company: "Independent",
    period: "2024 – Present",
    points: [
      "Drive technological advancement in IT companies by building and integrating next-generation tools and systems.",
      "Design proprietary software tools that automate processes and fill functionality gaps in existing suites.",
      "Lead modernization of IT systems: ITAM platforms, DevOps tooling and security platforms.",
      "Manage the full project lifecycle from assessment and strategy to deployment and user training.",
    ],
  },
  {
    role: "AI Integration Consultant for IT Companies",
    company: "Independent",
    period: "2024 – Aug 2025",
    points: [
      "Help IT companies embed AI into business operations to improve efficiency, security and decision-making.",
      "Automate workflows and implement AI-driven analytics and AI-assisted cybersecurity.",
      "Guide clients through AI strategy, tool selection and implementation with minimal disruption.",
    ],
  },
  {
    role: "System Administrator",
    company: "Corvit Systems",
    period: "Jan 2024 – Aug 2025",
    points: [
      "Handled day-to-day IT operations: network troubleshooting, user management and system issue resolution.",
      "Configured database users, Wi-Fi modems and secured the organisation's IT infrastructure.",
      "Provided full technical support to keep systems performing smoothly and securely.",
    ],
  },
  {
    role: "Junior Cybersecurity Specialist / IT Support Specialist",
    company: "AsonTechSol (onsite)",
    period: "Apr 2024 – Oct 2025",
    points: [
      "Identified vulnerabilities and hardened organisational systems and networks.",
      "Conducted website penetration testing to uncover and fix security weaknesses.",
      "Reviewed and scanned code to find and remediate security flaws.",
      "Maintained IT infrastructure: system updates, software installs and user account management.",
      "Performed website testing and analysis to improve system stability and reduce technical risk.",
    ],
  },
  {
    role: "Junior IT & Cyber Security Pen-Tester",
    company: "Corvit Peshawar / University",
    period: "Sep 2023 – 2024",
    points: [
      "Supported IT across departments, resolving network, printer and workstation issues.",
      "Mentored students on projects while completing Cloud Computing, System Administration and Cybersecurity certifications.",
      "Managed and troubleshot network devices and monitored network security.",
      "Maintained and repaired hardware: RAM, cabling, projectors and fingerprint devices.",
    ],
  },
  {
    role: "Freelance Security & IT Consultant",
    company: "Fiverr · Upwork · Local clients",
    period: "Jan 2022 – Present",
    points: [
      "Delivered website penetration testing, file forensics and online IT engagements for global clients.",
      "Completed projects across cybersecurity, network security and cloud security.",
      "Secured home and small-office networks by configuring routers, firewalls and hardening settings.",
      "Built and maintained websites with HTML, CSS and JavaScript for local businesses.",
      "Provided remote support with AnyDesk and TeamViewer, plus cloud storage and backup setup.",
    ],
  },
];

export type Project = {
  name: string;
  file: string;
  period?: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const projects: Project[] = [
  {
    name: "Complete Website Penetration Testing (Advanced)",
    file: "web_pentest_advanced.md",
    summary: "End-to-end web application security assessments across 5+ production applications.",
    points: [
      "Tested 5+ web applications, uncovering 20+ vulnerabilities including SQL injection and XSS.",
      "Delivered actionable remediation guidance and mitigated all critical findings.",
      "Produced developer-ready reports alongside executive summaries.",
    ],
    stack: ["Burp Suite", "SQLmap", "OWASP ZAP", "Nikto", "Nmap"],
  },
  {
    name: "Elastic SIEM Home Lab",
    file: "elastic_siem_lab.md",
    summary: "Built a full detection lab to monitor, alert on and triage security telemetry.",
    points: [
      "Configured Kali Linux endpoints and Elastic Agents to ship security logs.",
      "Detected and analysed 15+ simulated threats with real-time dashboards and alerting.",
      "Cut threat detection time by ~30% through optimized queries and dashboards.",
    ],
    stack: ["Elastic SIEM", "Kali Linux", "Elastic Agent", "KQL"],
  },
  {
    name: "Wireless Security Testing",
    file: "wireless_audit.md",
    summary: "Wireless assessment and hardening of a live network environment.",
    points: [
      "Identified and fixed 5+ vulnerabilities using Kali Linux, Aircrack-ng and Wireshark.",
      "Implemented WPA3 encryption, cutting unauthorized access risk by ~80%.",
      "Documented findings to sustain long-term wireless security.",
    ],
    stack: ["Aircrack-ng", "Wireshark", "Kali Linux", "WPA3"],
  },
  {
    name: "Cloud Security Hardening",
    file: "cloud_security.md",
    summary: "Secured cloud workloads with identity, encryption and network controls.",
    points: [
      "Implemented MFA for cloud accounts via SMS, email and authenticator apps.",
      "Configured Security Groups and NACLs to control inbound and outbound traffic.",
      "Enabled encryption at rest and in transit using SSL/TLS and AWS KMS.",
      "Ran vulnerability assessments, IAM policy reviews, logging, monitoring and pen tests.",
    ],
    stack: ["AWS", "Google Cloud", "IAM", "KMS", "CloudTrail"],
  },
  {
    name: "DECODE — Cloud Security Programme",
    file: "decode_program.md",
    period: "February 2024",
    summary:
      "Government initiative: selected among the top 25 candidates for a 2-month cloud security training programme.",
    points: [
      "Secured cloud data across 3 projects, reducing misconfiguration risk with best practices.",
      "Developed hands-on skills in cloud computing and storage protection.",
    ],
    stack: ["Cloud Security", "Storage Protection", "Best Practices"],
  },
  {
    name: "Commonwealth Bank — Cybersecurity Simulation",
    file: "cba_simulation.md",
    period: "August 2024",
    summary: "Forage job simulation based on a real Commonwealth Bank security programme.",
    points: [
      "Hands-on work in data analysis, incident response, security awareness and penetration testing.",
      "Solved real-world cybersecurity challenges in a simulated enterprise environment.",
    ],
    stack: ["Incident Response", "Data Analysis", "Pen Testing"],
  },
  {
    name: "New York Jobs CEO Council — Phishing Programme",
    file: "nyjcc_phishing.md",
    period: "September 2024",
    summary: "Designed and analysed a full phishing awareness simulation.",
    points: [
      "Built a phishing simulation, analysed results and presented findings for company-wide awareness.",
      "Evaluated phishing and email-scanning tooling for detection and prevention.",
    ],
    stack: ["Phishing Simulation", "Email Security", "Awareness Training"],
  },
  {
    name: "CTF & Real-World Challenge Grind",
    file: "ctf_challenges.md",
    summary: "Continuous hands-on practice across offensive security disciplines.",
    points: [
      "Completed 60+ TryHackMe rooms and Hack The Box challenges across web, cloud, network and API security.",
      "Solved 10+ CTF competitions, ranking in the top 20% of participants.",
      "Participated in hackathons in Pakistan and online, solving real-world challenges.",
    ],
    stack: ["TryHackMe", "Hack The Box", "CTF", "Metasploit"],
  },
];

export type CertGroup = { group: string; items: string[] };

export const certifications: CertGroup[] = [
  {
    group: "Offensive Security & Pen Testing",
    items: [
      "CompTIA PenTest+ (Penetration Tester)",
      "eLearnSecurity Web Application Penetration Tester (eWPT)",
      "Practical Ethical Hacking — TCM Security",
      "Certified Network Security Practitioner (CNSP)",
    ],
  },
  {
    group: "Security Fundamentals & Defence",
    items: [
      "CompTIA Security+",
      "Systems Security Certified Practitioner (SSCP)",
      "Google Cybersecurity Professional Certificate",
      "IBM & ISC2 Cybersecurity Specialist Professional Certificate",
      "Certified Cyber Security Professional — Corvit Peshawar",
      "IT Security: Defense Against the Digital Dark Arts",
      "Diploma in Virtualization Security — Advanced VMware Security",
    ],
  },
  {
    group: "Networking",
    items: [
      "Cisco Certified Network Associate (CCNA)",
      "Computer Networks and Network Security — Coursera",
      "Network Security Support Engineer",
    ],
  },
  {
    group: "Cloud",
    items: [
      "AWS Certified Solutions Architect – Associate",
      "AWS Cloud Practitioner Essentials",
      "Google Cloud Cybersecurity Professional Certificate",
      "Certified in Cloud Computing — Corvit",
    ],
  },
  {
    group: "AI & Programming",
    items: [
      "Google AI Essentials",
      "Introduction to Artificial Intelligence (AI)",
      "Certified Python Programmer — AsonTechSol",
      "Python Programming Essentials",
    ],
  },
  {
    group: "IT Support",
    items: ["Google IT Support Professional Certificate", "Practical Help Desk — TCM Security"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "Security Tooling",
    items: [
      "Kali Linux",
      "Metasploit",
      "Burp Suite",
      "Nmap",
      "Nikto",
      "Wireshark",
      "Aircrack-ng",
      "SQLmap",
      "OWASP ZAP",
      "Splunk",
      "Wazuh",
      "Microsoft Defender",
      "pfSense",
    ],
  },
  {
    group: "Programming & Scripting",
    items: ["Python", "Bash", "Java", "C++", "JavaScript", "HTML", "CSS", "SQL"],
  },
  {
    group: "Cloud & Infrastructure",
    items: [
      "AWS",
      "Google Cloud",
      "Docker",
      "Kubernetes",
      "Terraform",
      "VMware",
      "Linux",
      "Windows Server",
      "Active Directory",
      "Git",
    ],
  },
  {
    group: "Monitoring & Operations",
    items: ["Zabbix", "Nagios", "Zendesk", "Power BI", "TeamViewer", "AnyDesk", "MongoDB", "Apache"],
  },
  {
    group: "AI",
    items: ["LLM integration", "Chatbot development", "AI API integration", "AI workflow automation"],
  },
];

export const cvFiles = [
  {
    label: "Cyber Security Specialist CV",
    file: "osama_khan_cyber_security.pdf",
    url: cvCyber.url,
    size: cvCyber.size,
  },
  {
    label: "IT Specialist CV",
    file: "osama_khan_it_specialist.pdf",
    url: cvIt.url,
    size: cvIt.size,
  },
];

/** Plain-text knowledge base handed to the AI assistant. */
export function buildKnowledgeBase(): string {
  const lines: string[] = [];
  lines.push(`NAME: ${profile.name} (alias ${profile.handle})`);
  lines.push(`TITLES: ${profile.titles.join(", ")}`);
  lines.push(`CONTACT: use the Contact window form or LinkedIn. Personal email/phone/location are private.`);
  lines.push(`LINKEDIN: ${profile.linkedin} | WEBSITE: ${profile.website}`);
  lines.push(`AVAILABILITY: ${profile.availability}`);
  lines.push(`SUMMARY: ${profile.summary}`);
  lines.push(`STRENGTHS: ${profile.highlights.join("; ")}`);
  lines.push(
    `LANGUAGES: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(", ")}`,
  );
  lines.push(
    `EDUCATION: ${profile.education.map((e) => `${e.school} — ${e.field}, ${e.year}`).join("; ")}`,
  );
  lines.push("EXPERIENCE:");
  for (const job of experience) {
    lines.push(`- ${job.role} @ ${job.company} (${job.period}): ${job.points.join(" ")}`);
  }
  lines.push("PROJECTS:");
  for (const p of projects) {
    lines.push(
      `- ${p.name}${p.period ? ` (${p.period})` : ""}: ${p.summary} ${p.points.join(" ")} Tools: ${p.stack.join(", ")}.`,
    );
  }
  lines.push("CERTIFICATIONS:");
  for (const c of certifications) {
    lines.push(`- ${c.group}: ${c.items.join(", ")}`);
  }
  lines.push("SKILLS:");
  for (const s of skills) {
    lines.push(`- ${s.group}: ${s.items.join(", ")}`);
  }
  return lines.join("\n");
}

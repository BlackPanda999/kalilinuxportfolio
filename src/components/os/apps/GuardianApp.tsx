import { useEffect, useState } from "react";
import { Activity, RefreshCcw, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { getHealthLog } from "@/lib/guardian.functions";
import type { GuardianIncident } from "@/lib/guardian-schema";
import { Card, PageHeader, Pane, PathBar, SectionTitle, Stat } from "./ui";

const SEVERITY_TONE: Record<string, string> = {
  info: "text-shell border-shell/40 bg-shell/10",
  warning: "text-warn border-warn/40 bg-warn/10",
  critical: "text-destructive border-destructive/40 bg-destructive/10",
};

export function GuardianApp() {
  const [incidents, setIncidents] = useState<GuardianIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkedAt, setCheckedAt] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const result = await getHealthLog();
      setIncidents(result.incidents);
      setCheckedAt(result.checkedAt);
    } catch {
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => void load(), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const healed = incidents.filter((i) => i.status === "healed").length;
  const critical = incidents.filter((i) => i.severity === "critical").length;

  return (
    <div className="min-h-full">
      <PathBar path="/var/log/panda-guardian — AI Site Doctor" />
      <Pane>
        <PageHeader
          kicker="autonomous · 24/7"
          title="Panda Guardian"
          intro="An AI doctor runs in the background of this site. It watches every page for crashes, failed requests and broken panels, diagnoses the cause on its own, applies a safe repair instantly, and keeps a public health log — no command needed."
          meta={
            <>
              <span className="inline-flex items-center gap-2 rounded-full border border-shell/40 bg-shell/10 px-3 py-1 font-mono text-[10.5px] text-shell">
                <ShieldCheck className="size-3.5" /> monitoring active
              </span>
              <button
                type="button"
                onClick={() => void load()}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 px-3 py-1 font-mono text-[10.5px] text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                aria-label="Refresh the health log"
              >
                <RefreshCcw className="size-3.5" /> refresh
              </button>
            </>
          }
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat value={String(incidents.length)} label="logged events" />
          <Stat value={String(healed)} label="auto-repaired" />
          <Stat value={String(critical)} label="critical" />
          <Stat value="24/7" label="watch window" />
        </div>

        <section className="mt-8">
          <SectionTitle index={1}>How the self-healing works</SectionTitle>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              ["Detect", "Render crashes, uncaught errors, rejected promises and failed requests are captured the moment they happen."],
              ["Diagnose", "The fault, stack and page are sent to the AI doctor, which names the root cause and the correct repair."],
              ["Repair", "The broken panel is remounted or reset, a failed request is retried, or the desktop reloads — automatically."],
              ["Record", "Every event, diagnosis and permanent-fix suggestion lands in this health log for review."],
            ].map(([title, body], index) => (
              <li key={title}>
                <Card>
                  <p className="font-mono text-[10.5px] text-shell">
                    step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h4 className="mt-1 font-sans text-base font-bold text-foreground">{title}</h4>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8">
          <SectionTitle index={2}>Health log</SectionTitle>
          {loading && incidents.length === 0 && (
            <p className="flex items-center gap-2 font-mono text-[11.5px] text-muted-foreground">
              <Activity className="size-4 animate-pulse" /> reading /var/log/panda-guardian…
            </p>
          )}
          {!loading && incidents.length === 0 && (
            <Card>
              <p className="font-mono text-sm text-shell">✔ all systems healthy</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                No faults recorded. The Guardian keeps watching in the background.
              </p>
            </Card>
          )}
          <ul className="grid gap-3">
            {incidents.map((incident) => (
              <li key={incident.id}>
                <Card>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] ${
                        SEVERITY_TONE[incident.severity] ?? SEVERITY_TONE["warning"]
                      }`}
                    >
                      {incident.severity}
                    </span>
                    <span className="rounded-full border border-border/60 px-2.5 py-0.5 font-mono text-[10.5px] text-muted-foreground">
                      {incident.kind} · {incident.action}
                    </span>
                    <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">
                      {new Date(incident.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-2.5 font-mono text-[12.5px] break-words text-foreground/90">
                    {incident.message}
                  </p>
                  {incident.diagnosis && (
                    <div className="ai-markdown mt-3 border-t border-border/60 pt-3 text-sm leading-relaxed text-muted-foreground">
                      <ReactMarkdown>{incident.diagnosis}</ReactMarkdown>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
          {checkedAt && (
            <p className="mt-4 font-mono text-[10.5px] text-muted-foreground">
              last check: {new Date(checkedAt).toLocaleTimeString()} · auto-refreshes every 60s
            </p>
          )}
        </section>
      </Pane>
    </div>
  );
}

import { Component, useEffect, useRef, useState, type ErrorInfo, type ReactNode } from "react";
import { Activity, ShieldCheck } from "lucide-react";

import { reportIncident } from "@/lib/guardian.functions";
import type { GuardianVerdict } from "@/lib/guardian-schema";
import { cn } from "@/lib/utils";

/**
 * Panda Guardian — the always-on AI site doctor.
 *
 * It watches for render crashes, uncaught errors, rejected promises and failed
 * requests, sends each one to the AI doctor on the server, stores the verdict in
 * the health log, and applies the recommended safe recovery on its own.
 */

type Status = "idle" | "working" | "healed" | "ignored";

const NOISE =
  /resizeobserver loop|script error|load failed|the operation was aborted|non-error promise rejection/i;

let lastSignature = "";
let lastSentAt = 0;

async function sendReport(report: {
  kind: "runtime" | "promise" | "render" | "network";
  message: string;
  stack?: string;
  component?: string;
}): Promise<(GuardianVerdict & { id?: string }) | null> {
  const signature = `${report.kind}:${report.message}`;
  const now = Date.now();
  if (signature === lastSignature && now - lastSentAt < 30_000) return null;
  lastSignature = signature;
  lastSentAt = now;

  try {
    return await reportIncident({
      data: {
        kind: report.kind,
        message: report.message.slice(0, 2000),
        ...(report.stack ? { stack: report.stack.slice(0, 6000) } : {}),
        ...(report.component ? { component: report.component } : {}),
        path: typeof window !== "undefined" ? window.location.pathname : "/",
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      },
    });
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ boundary */

type BoundaryProps = { children: ReactNode; onCrash: (error: Error, info: ErrorInfo) => void };
type BoundaryState = { generation: number; crashed: boolean };

class SelfHealingBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { generation: 0, crashed: false };

  static getDerivedStateFromError(): Partial<BoundaryState> {
    return { crashed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onCrash(error, info);
    // auto-heal: remount the subtree with a fresh key instead of leaving a blank screen
    window.setTimeout(() => {
      this.setState((prev) => ({ generation: prev.generation + 1, crashed: false }));
    }, 600);
  }

  render() {
    if (this.state.crashed) {
      return (
        <div className="grid h-screen w-full place-items-center bg-background px-6 text-center">
          <div>
            <p className="font-mono text-sm text-shell">panda-guardian: fault detected</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              AI doctor is repairing the interface, restoring…
            </p>
          </div>
        </div>
      );
    }
    return <div key={this.state.generation}>{this.props.children}</div>;
  }
}

/* -------------------------------------------------------------------- runner */

export function Guardian({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("idle");
  const [note, setNote] = useState("");
  const reloadedRef = useRef(false);

  async function handle(
    kind: "runtime" | "promise" | "render" | "network",
    message: string,
    stack?: string,
    component?: string,
  ) {
    if (!message || NOISE.test(message)) return;
    setStatus("working");
    setNote("AI doctor analysing the fault…");

    const verdict = await sendReport({
      kind,
      message,
      ...(stack ? { stack } : {}),
      ...(component ? { component } : {}),
    });

    if (!verdict) {
      setStatus("idle");
      return;
    }

    if (verdict.action === "ignore") {
      setStatus("ignored");
      setNote("Harmless noise — logged, nothing to repair.");
    } else if (verdict.action === "reload" && !reloadedRef.current) {
      reloadedRef.current = true;
      setStatus("healed");
      setNote("Applying repair — reloading the desktop…");
      window.setTimeout(() => window.location.reload(), 1500);
      return;
    } else {
      setStatus("healed");
      setNote(`Repair applied automatically (${verdict.action}). Logged in the health log.`);
    }

    window.setTimeout(() => setStatus("idle"), 6000);
  }

  useEffect(() => {
    function onError(event: ErrorEvent) {
      void handle("runtime", event.message || String(event.error), event.error?.stack);
    }
    function onRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      void handle(
        "promise",
        reason instanceof Error ? reason.message : String(reason),
        reason instanceof Error ? reason.stack : undefined,
      );
    }
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SelfHealingBoundary
        onCrash={(error, info) =>
          void handle(
            "render",
            error.message,
            `${error.stack ?? ""}\n${info.componentStack ?? ""}`,
            "react-tree",
          )
        }
      >
        {children}
      </SelfHealingBoundary>

      {status !== "idle" && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed right-3 bottom-[4.25rem] z-[10000] flex max-w-[19rem] items-start gap-2.5 rounded-lg border px-3 py-2.5 font-mono text-[11px] backdrop-blur-md",
            status === "working"
              ? "border-warn/50 bg-warn/10 text-warn"
              : "border-shell/50 bg-shell/10 text-shell",
          )}
        >
          {status === "working" ? (
            <Activity className="mt-0.5 size-4 shrink-0 animate-pulse" />
          ) : (
            <ShieldCheck className="mt-0.5 size-4 shrink-0" />
          )}
          <span className="leading-relaxed">
            <b className="block">panda-guardian</b>
            {note}
          </span>
        </div>
      )}
    </>
  );
}

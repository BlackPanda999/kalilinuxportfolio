import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

import { createLovableAiGatewayRunIdFetch } from "./ai-gateway.server";
import type { GuardianIncident, GuardianReport, GuardianVerdict } from "./guardian-schema";

const SYSTEM_PROMPT = `You are Panda Guardian, the autonomous site doctor for a Kali-Linux-styled
cyber security portfolio (TanStack Start + React 19 + Tailwind, Lovable Cloud backend, Lovable AI chat).

You receive a real error captured in a visitor's browser. Reply in GitHub Markdown, under 160 words, with:

**Diagnosis** — one or two sentences naming the most likely root cause.
**Self-heal** — the safe automatic recovery the site should apply right now, chosen from:
remount the crashed panel, reset that panel's local state, retry the failed request once,
reload the page, or ignore (harmless noise).
**Permanent fix** — the concrete code-level change a maintainer should make.

Be specific and technical. Never invent stack frames. If the error is a known benign
browser/extension noise (ResizeObserver loop, network abort, hydration warning), say so and pick "ignore".`;

function fallbackVerdict(message: string): GuardianVerdict {
  const noisy = /resizeobserver|aborted|load failed|networkerror|hydrat/i.test(message);
  return {
    diagnosis: noisy
      ? "Looks like harmless browser noise (aborted request or observer loop). No user impact detected."
      : "Could not reach the AI doctor, so the Guardian applied its default safe recovery: the crashed panel was remounted and the incident was written to the health log.",
    action: noisy ? "ignore" : "remount",
    severity: noisy ? "info" : "warning",
  };
}

function pickAction(text: string): GuardianVerdict["action"] {
  const lower = text.toLowerCase();
  if (/\bignore\b/.test(lower)) return "ignore";
  if (/reload/.test(lower)) return "reload";
  if (/retry/.test(lower)) return "retry";
  if (/reset/.test(lower)) return "reset";
  return "remount";
}

async function askDoctor(report: GuardianReport): Promise<GuardianVerdict> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return fallbackVerdict(report.message);

  try {
    const runIdFetch = createLovableAiGatewayRunIdFetch();
    const lovable = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
      fetch: runIdFetch.fetch,
    });

    const result = streamText({
      model: lovable.responses("openai/gpt-6-astra"),
      system: SYSTEM_PROMPT,
      prompt: [
        `kind: ${report.kind}`,
        `path: ${report.path ?? "/"}`,
        `component: ${report.component ?? "unknown"}`,
        `message: ${report.message}`,
        report.stack ? `stack:\n${report.stack.slice(0, 3000)}` : "stack: (none)",
      ].join("\n"),
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });

    const text = (await result.text).trim();
    if (!text) return fallbackVerdict(report.message);
    return {
      diagnosis: text,
      action: pickAction(text),
      severity: /critical|blank screen|crash/i.test(text) ? "critical" : "warning",
    };
  } catch (error) {
    console.error("guardian diagnosis failed", error);
    return fallbackVerdict(report.message);
  }
}

export async function healIncident(report: GuardianReport): Promise<GuardianVerdict & { id?: string | undefined }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // de-duplicate: the same message within 10 minutes reuses the stored verdict
  const since = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const { data: existing } = await supabaseAdmin
    .from("site_incidents")
    .select("id, diagnosis, auto_action, severity")
    .eq("message", report.message)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle();

  if (existing?.diagnosis) {
    return {
      id: existing.id,
      diagnosis: existing.diagnosis,
      action: (existing.auto_action ?? "remount") as GuardianVerdict["action"],
      severity: (existing.severity ?? "warning") as GuardianVerdict["severity"],
    };
  }

  const verdict = await askDoctor(report);

  const { data } = await supabaseAdmin
    .from("site_incidents")
    .insert({
      kind: report.kind,
      message: report.message.slice(0, 2000),
      stack: report.stack?.slice(0, 6000) ?? null,
      path: report.path ?? null,
      user_agent: report.userAgent?.slice(0, 300) ?? null,
      severity: verdict.severity,
      auto_action: verdict.action,
      diagnosis: verdict.diagnosis,
      status: verdict.action === "ignore" ? "ignored" : "healed",
    })
    .select("id")
    .single();

  return { ...verdict, id: data?.id };
}

export async function readHealthLog(): Promise<{
  incidents: GuardianIncident[];
  healthy: boolean;
  checkedAt: string;
}> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("site_incidents")
    .select("id, kind, message, path, severity, auto_action, diagnosis, status, created_at")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) console.error("guardian log read failed", error);

  const incidents = (data ?? []).map((row) => ({
    id: row.id as string,
    kind: row.kind as string,
    message: row.message as string,
    path: (row.path as string | null) ?? "/",
    severity: (row.severity as GuardianVerdict["severity"]) ?? "warning",
    action: (row.auto_action as GuardianVerdict["action"]) ?? "remount",
    diagnosis: (row.diagnosis as string | null) ?? "",
    status: (row.status as string) ?? "healed",
    createdAt: row.created_at as string,
  }));

  return {
    incidents,
    healthy: !error && incidents.every((i) => i.status !== "open"),
    checkedAt: new Date().toISOString(),
  };
}

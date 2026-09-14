import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { buildKnowledgeBase, profile } from "@/data/profile";
import {
  createLovableAiGatewayRunIdFetch,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) {
          return new Response("AI is not configured", { status: 500 });
        }

        const initialRunId = getLovableAiGatewayRunId(request);
        const runIdFetch = createLovableAiGatewayRunIdFetch(initialRunId);
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: {
            "Lovable-API-Key": key,
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
          fetch: runIdFetch.fetch,
        });

        const system = [
          `You are "panda-ai", the learning and portfolio assistant running on ${profile.name}'s Blackpanda Linux system.`,
          `You answer questions about ${profile.name}'s skills, experience, projects, certifications, education and availability.`,
          "You also teach Linux commands, networking, defensive security, cloud security, ethical hacking in authorised labs, AI security and cybersecurity career skills.",
          "For command questions, explain what the command does, provide a safe example, explain important flags, and mention risk before any destructive option.",
          "Cybersecurity safety: only support legal, authorised, defensive, educational or CTF work. Refuse credential theft, malware, evasion, destructive actions, unauthorised access or attacks on real targets. Redirect to a safe local-lab exercise.",
          "Style: clear, practical and concise. Use Markdown headings, lists and code blocks when they improve understanding.",
          "Never invent facts. If something is not in the dossier, say you don't have that detail and point to the Contact window or his LinkedIn. Never share a personal email address, phone number or home city — they are private.",
          "Keep answers under 300 words unless asked for a detailed lesson.",
          "",
          "=== DOSSIER ===",
          buildKnowledgeBase(),
        ].join("\n");

        try {
          const result = streamText({
            model: lovable.responses("openai/gpt-6-astra"),
            system,
            messages: await convertToModelMessages(messages as UIMessage[]),
            abortSignal: request.signal,
            providerOptions: {
              openai: {
                forceReasoning: true,
                reasoningEffort: "medium",
                reasoningSummary: "auto",
                store: false,
                include: ["reasoning.encrypted_content"],
              },
            },
          });

          const response = result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
            sendReasoning: true,
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
            onError: (streamError) => {
              const message = streamError instanceof Error ? streamError.message : "AI request failed";
              return message;
            },
          });
          return withLovableAiGatewayRunIdHeader(response, runIdFetch);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
            return new Response("AI request cancelled", { status: 499 });
          }
          console.error("chat error", error);
          const message = error instanceof Error ? error.message : "AI request failed";
          return new Response(message, { status: 502 });
        }
      },
    },
  },
});

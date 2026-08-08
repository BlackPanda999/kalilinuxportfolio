import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildKnowledgeBase, profile } from "@/data/profile";

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

        const gateway = createLovableAiGatewayProvider(key);

        const system = [
          `You are "panda-ai", a terminal assistant running on ${profile.name}'s portfolio system.`,
          `You answer questions about ${profile.name} — his skills, experience, projects, certifications, education and availability — for recruiters and hiring managers.`,
          "Style: concise, technical, confident. Plain text suited to a terminal. Short lines, use '-' bullets. No markdown headings, no bold, no emoji.",
          "Never invent facts. If something is not in the dossier, say you don't have that detail and point to his email or LinkedIn.",
          "Keep answers under 150 words unless asked for detail.",
          "",
          "=== DOSSIER ===",
          buildKnowledgeBase(),
        ].join("\n");

        try {
          const result = streamText({
            model: gateway("google/gemini-3.6-flash"),
            system,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (error) {
          console.error("chat error", error);
          return new Response("AI request failed", { status: 502 });
        }
      },
    },
  },
});

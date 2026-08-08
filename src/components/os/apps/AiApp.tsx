import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CornerDownLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { profile } from "@/data/profile";

const SUGGESTIONS = [
  "What are Osama's strongest security skills?",
  "Summarise his cloud security experience",
  "Which pen-testing tools has he used?",
  "Is he a good fit for a SOC analyst role?",
];

export function AiApp() {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, status]);

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    void sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col font-mono text-[13px]"
      style={{ backgroundColor: "var(--color-terminal)" }}
    >
      <div className="term-scroll min-h-0 flex-1 space-y-4 overflow-auto p-4">
        <div className="text-foreground/70">
          <p className="text-shell">panda-ai v1.0 — knowledge base: {profile.name}</p>
          <p className="mt-1">
            Ask anything about his experience, projects, certifications or availability.
          </p>
        </div>

        {messages.length === 0 && (
          <ul className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  onClick={() => ask(suggestion)}
                  className="rounded-sm border border-border px-2.5 py-1.5 text-left text-[11px] text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        )}

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          if (message.role === "user") {
            return (
              <p key={message.id} className="break-words">
                <span className="text-shell">visitor@{profile.host}</span>
                <span className="text-muted-foreground">:~$ </span>
                <span className="text-foreground">{text}</span>
              </p>
            );
          }
          return (
            <pre
              key={message.id}
              className="border-l-2 border-primary/50 pl-3 whitespace-pre-wrap break-words text-foreground/85"
            >
              {text}
            </pre>
          );
        })}

        {status === "submitted" && (
          <p className="text-muted-foreground">
            panda-ai is thinking<span className="caret-blink">_</span>
          </p>
        )}

        {error && (
          <p className="text-destructive">
            panda-ai: request failed. Please try again in a moment, or email {profile.email}.
          </p>
        )}

        <div ref={endRef} />
      </div>

      <form
        className="flex items-center gap-2 border-t border-border/50 px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          ask(input);
        }}
      >
        <span className="text-shell">?</span>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={busy ? "waiting for response..." : "ask about Osama..."}
          disabled={busy}
          aria-label="Ask the AI assistant"
          spellCheck={false}
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send question"
          className="grid size-7 place-items-center rounded-sm bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <CornerDownLeft className="size-3.5" />
        </button>
      </form>
    </div>
  );
}

import { AlertCircle, CheckCircle2, Globe, Linkedin, Loader2, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { profile } from "@/data/profile";
import { contactSchema } from "@/lib/contact-schema";
import { sendContactMessage } from "@/lib/contact.functions";
import { cn } from "@/lib/utils";
import { Chip, Pane, PageHeader, PathBar, SectionTitle } from "./ui";

const rows = [
  {
    icon: Linkedin,
    label: "linkedin",
    value: "linkedin.com/in/osamakhan44",
    href: profile.linkedin,
  },
  { icon: Globe, label: "website", value: "blackpanda999.base44.app", href: profile.website },
];

type Errors = Partial<Record<"name" | "email" | "subject" | "message", string>>;

const fieldClass =
  "w-full rounded-lg border bg-terminal/70 px-3.5 py-2.5 font-mono text-[13px] text-foreground placeholder:text-muted-foreground/60 transition-colors focus:outline-none focus:ring-1";

export function ContactApp() {
  const mounted = useRef(Date.now());
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", company: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    mounted.current = Date.now();
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (status === "sending") return;

    const payload = { ...form, elapsedMs: Date.now() - mounted.current, source: "desktop/contact" };
    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      if (Object.keys(next).length === 0) {
        setStatus("error");
        setNotice("Submission blocked — please try again.");
      }
      return;
    }

    setStatus("sending");
    setNotice("");
    try {
      const result = await sendContactMessage({ data: parsed.data });
      if (result.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "", company: "" });
        setNotice("Message delivered — I'll reply within 24 hours.");
      } else {
        setStatus("error");
        setNotice(result.error);
      }
    } catch {
      setStatus("error");
      setNotice("Network error — please try again or email me directly.");
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <PathBar path="/etc/contact.conf" />
      <Pane className="flex-1 space-y-7">
        <PageHeader
          kicker="get in touch"
          title="Let's connect"
          intro="Open to cyber security, IT and AI integration roles in Saudi Arabia and remote engagements worldwide."
          meta={profile.availability.split(" · ").map((item) => <Chip key={item}>{item}</Chip>)}
        />

        <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* form */}
          <section>
            <SectionTitle index={1}>Send a message</SectionTitle>
            <form onSubmit={submit} noValidate className="space-y-3.5">
              {/* honeypot — hidden from humans */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                value={form.company}
                onChange={(event) => set("company", event.target.value)}
                className="pointer-events-none absolute size-0 opacity-0"
              />

              <div className="grid gap-3.5 sm:grid-cols-2">
                <Field label="name" error={errors.name}>
                  <input
                    value={form.name}
                    onChange={(event) => set("name", event.target.value)}
                    placeholder="Your name"
                    maxLength={80}
                    autoComplete="name"
                    aria-label="Your name"
                    className={cn(
                      fieldClass,
                      errors.name
                        ? "border-destructive/70 focus:ring-destructive"
                        : "border-border/70 focus:border-primary/70 focus:ring-primary/50",
                    )}
                  />
                </Field>
                <Field label="email" error={errors.email}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => set("email", event.target.value)}
                    placeholder="you@company.com"
                    maxLength={160}
                    autoComplete="email"
                    aria-label="Your email"
                    className={cn(
                      fieldClass,
                      errors.email
                        ? "border-destructive/70 focus:ring-destructive"
                        : "border-border/70 focus:border-primary/70 focus:ring-primary/50",
                    )}
                  />
                </Field>
              </div>

              <Field label="subject (optional)" error={errors.subject}>
                <input
                  value={form.subject}
                  onChange={(event) => set("subject", event.target.value)}
                  placeholder="Penetration test enquiry"
                  maxLength={120}
                  aria-label="Subject"
                  className={cn(fieldClass, "border-border/70 focus:border-primary/70 focus:ring-primary/50")}
                />
              </Field>

              <Field label="message" error={errors.message} hint={`${form.message.length}/2000`}>
                <textarea
                  value={form.message}
                  onChange={(event) => set("message", event.target.value)}
                  placeholder="Tell me about the role, project or assessment…"
                  rows={5}
                  maxLength={2000}
                  aria-label="Your message"
                  className={cn(
                    fieldClass,
                    "min-h-32 resize-y leading-relaxed",
                    errors.message
                      ? "border-destructive/70 focus:ring-destructive"
                      : "border-border/70 focus:border-primary/70 focus:ring-primary/50",
                  )}
                />
              </Field>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-mono text-[12px] font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "sending" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  {status === "sending" ? "transmitting…" : "send message"}
                </button>
                <span className="font-mono text-[10.5px] text-muted-foreground">
                  encrypted transport · spam filtered
                </span>
              </div>

              {notice && (
                <p
                  role="status"
                  className={cn(
                    "flex items-start gap-2 rounded-lg border px-3.5 py-3 font-mono text-[12px]",
                    status === "sent"
                      ? "border-shell/40 bg-shell/10 text-shell"
                      : "border-destructive/40 bg-destructive/10 text-destructive",
                  )}
                >
                  {status === "sent" ? (
                    <CheckCircle2 className="mt-px size-4 shrink-0" />
                  ) : (
                    <AlertCircle className="mt-px size-4 shrink-0" />
                  )}
                  {notice}
                </p>
              )}
            </form>
          </section>

          {/* direct channels */}
          <section>
            <SectionTitle index={2}>Direct channels</SectionTitle>
            <ul className="grid gap-2.5">
              {rows.map((row) => (
                <li
                  key={row.label}
                  className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card/40 px-3.5 py-3 transition-all hover:-translate-y-0.5 hover:border-primary/50"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/70 bg-secondary/50 text-primary transition-colors group-hover:border-primary/50 group-hover:bg-primary/10">
                    <row.icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
                      {row.label}
                    </span>
                    {row.href ? (
                      <a
                        href={row.href}
                        target={row.href.startsWith("http") ? "_blank" : undefined}
                        rel="noreferrer"
                        className="block truncate text-[13.5px] text-foreground/90 hover:text-primary"
                      >
                        {row.value}
                      </a>
                    ) : (
                      <span className="block truncate text-[13.5px] text-foreground/90">
                        {row.value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 rounded-xl border border-shell/25 bg-terminal/60 p-4 font-mono text-[11.5px] leading-relaxed text-shell/90">
              <p>
                <span className="text-primary">
                  {profile.handle}@{profile.host}
                </span>
                :~$ ./send_message.sh --via contact-form
              </p>
              <p className="mt-1 text-muted-foreground">// replies usually within 24 hours</p>
            </div>
          </section>
        </div>
      </Pane>
    </div>
  );
}

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 font-mono text-[10px] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
        {hint && <span className="ml-auto tracking-normal normal-case">{hint}</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block font-mono text-[11px] text-destructive">{error}</span>
      )}
    </label>
  );
}

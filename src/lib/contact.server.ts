import { z } from "zod";

/** Shared shape for the contact form — used on the client and the server. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(160, "Email is too long"),
  subject: z.string().trim().max(120, "Subject is too long").optional().default(""),
  message: z
    .string()
    .trim()
    .min(15, "Please write at least 15 characters")
    .max(2000, "Message must be under 2000 characters"),
  /** honeypot — must stay empty; bots fill it in */
  company: z.string().max(0).optional().default(""),
  /** ms the visitor spent on the form before submitting */
  elapsedMs: z.number().int().nonnegative().max(1000 * 60 * 60 * 6),
  source: z.string().trim().max(120).optional().default("desktop"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult = { ok: true; id: string } | { ok: false; error: string };

const LINK_RE = /https?:\/\//gi;

function looksLikeSpam(input: ContactInput): string | null {
  if (input.company && input.company.length > 0) return "Submission blocked.";
  if (input.elapsedMs < 2500) return "That was too fast — please try again.";
  const links = input.message.match(LINK_RE)?.length ?? 0;
  if (links > 2) return "Please remove the extra links from your message.";
  if (/\b(viagra|casino|crypto\s?giveaway|seo\s?service|backlinks)\b/i.test(input.message)) {
    return "Submission blocked.";
  }
  // all-caps shouting or a single repeated character
  if (/(.)\1{25,}/.test(input.message)) return "Submission blocked.";
  return null;
}

/**
 * Persists a contact message with the privileged client. The table has no
 * browser-facing policies, so only this server path can write to it.
 */
export async function saveContactMessage(input: ContactInput): Promise<ContactResult> {
  const spam = looksLikeSpam(input);
  if (spam) return { ok: false, error: spam };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count } = await supabaseAdmin
    .from("contact_messages")
    .select("id", { count: "exact", head: true })
    .eq("email", input.email)
    .gte("created_at", since);

  if ((count ?? 0) >= 3) {
    return { ok: false, error: "Too many messages sent — please try again in a few minutes." };
  }

  const { data, error } = await supabaseAdmin
    .from("contact_messages")
    .insert({
      name: input.name,
      email: input.email,
      subject: input.subject || null,
      message: input.message,
      source: input.source || "desktop",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("contact insert failed", error);
    return { ok: false, error: "Could not deliver the message. Please email me directly." };
  }

  return { ok: true, id: data.id };
}

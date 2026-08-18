import { contactSchema, type ContactInput, type ContactResult } from "./contact-schema";

export { contactSchema };
export type { ContactInput, ContactResult };

const LINK_RE = /https?:\/\//gi;

function looksLikeSpam(input: ContactInput): string | null {
  if (input.company && input.company.length > 0) return "Submission blocked.";
  if (input.elapsedMs < 2500) return "That was too fast — please try again.";
  const links = input.message.match(LINK_RE)?.length ?? 0;
  if (links > 2) return "Please remove the extra links from your message.";
  if (/\b(viagra|casino|crypto\s?giveaway|seo\s?service|backlinks)\b/i.test(input.message)) {
    return "Submission blocked.";
  }
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

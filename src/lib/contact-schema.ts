import { z } from "zod";

/** Shared shape for the contact form — safe to import on the client. */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(80, "Name is too long"),
  email: z.string().trim().email("Enter a valid email address").max(160, "Email is too long"),
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

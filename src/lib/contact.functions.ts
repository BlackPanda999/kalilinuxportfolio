import { createServerFn } from "@tanstack/react-start";

import { contactSchema, saveContactMessage, type ContactResult } from "./contact.server";

export const sendContactMessage = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }): Promise<ContactResult> => saveContactMessage(data));

import { z } from "zod";

export const guardianReportSchema = z.object({
  kind: z.enum(["runtime", "promise", "render", "network", "selfcheck"]).default("runtime"),
  message: z.string().min(1).max(2000),
  stack: z.string().max(6000).optional(),
  path: z.string().max(300).optional(),
  component: z.string().max(120).optional(),
  userAgent: z.string().max(300).optional(),
});

export type GuardianReport = z.infer<typeof guardianReportSchema>;

export type GuardianVerdict = {
  diagnosis: string;
  action: "ignore" | "retry" | "reset" | "remount" | "reload";
  severity: "info" | "warning" | "critical";
};

export type GuardianIncident = {
  id: string;
  kind: string;
  message: string;
  path: string;
  severity: GuardianVerdict["severity"];
  action: GuardianVerdict["action"];
  diagnosis: string;
  status: string;
  createdAt: string;
};

import { createServerFn } from "@tanstack/react-start";

import { guardianReportSchema } from "./guardian-schema";
import type { GuardianIncident, GuardianVerdict } from "./guardian-schema";

export const reportIncident = createServerFn({ method: "POST" })
  .validator((data: unknown) => guardianReportSchema.parse(data))
  .handler(async ({ data }): Promise<GuardianVerdict & { id?: string | undefined }> => {
    const { healIncident } = await import("./guardian.server");
    return healIncident(data);
  });

export const getHealthLog = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ incidents: GuardianIncident[]; healthy: boolean; checkedAt: string }> => {
    const { readHealthLog } = await import("./guardian.server");
    return readHealthLog();
  },
);

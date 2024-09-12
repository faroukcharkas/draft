import { z } from "zod";

export const predictRequestSchema = z.object({
  textBeforeCursor: z.string(),
  textAfterCursor: z.string(),
});

export type PredictRequest = z.infer<typeof predictRequestSchema>;

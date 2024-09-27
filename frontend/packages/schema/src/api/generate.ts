import { z } from "zod";

export const generateInputSchema = z.object({
  selection: z.string(),
  command: z.string(),
});

export type GenerateInput = z.infer<typeof generateInputSchema>;

export const generateOutputSchema = z.object({
  generation: z.string(),
});

export type GenerateOutput = z.infer<typeof generateOutputSchema>;

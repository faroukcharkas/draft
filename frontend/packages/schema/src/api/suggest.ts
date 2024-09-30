import { z } from "zod";

export const suggestInputSchema = z.object({
  text_before_cursor: z.string(),
  text_after_cursor: z.string(),
  document_id: z.string().optional(),
});

export type SuggestInput = z.infer<typeof suggestInputSchema>;

export const suggestOutputSchema = z.object({
  next_words: z.string(),
});

export type SuggestOutput = z.infer<typeof suggestOutputSchema>;

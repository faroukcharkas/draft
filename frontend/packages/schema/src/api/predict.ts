import { z } from "zod";

export const suggestInputSchema = z.object({
  text_before_cursor: z.string(),
  text_after_cursor: z.string(),
});

export type SuggestInput = z.infer<typeof suggestInputSchema>;

export const suggestOutputSchema = z.object({
  words_before_suggestion: z.string(),
  suggestion: z.string(),
  words_after_suggestion: z.string(),
});

export type SuggestOutput = z.infer<typeof suggestOutputSchema>;

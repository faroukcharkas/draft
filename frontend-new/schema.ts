import { z } from "zod";

export const coreMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string().min(1),
})

export type CoreMessage = z.infer<typeof coreMessageSchema>;

export const trainingSetSchema = z.object({
    messages: z.array(coreMessageSchema),
})

export type TrainingSet = z.infer<typeof trainingSetSchema>;

export const extractedTextSchema = z.object({
    text: z.string().min(1),
    startPosition: z.number(),
})

export type ExtractedText = z.infer<typeof extractedTextSchema>;
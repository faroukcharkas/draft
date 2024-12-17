import { z } from "zod";

const trainingMessageSchema = z.object({
    role: z.enum(["user", "assistant", "system"]),
    content: z.string(),
})

export type TrainingMessage = z.infer<typeof trainingMessageSchema>;

const trainingMessagePairSchema = z.object({
    user: trainingMessageSchema,
    assistant: trainingMessageSchema,
})

export type TrainingMessagePair = z.infer<typeof trainingMessagePairSchema>;

const trainingMessagesSchema = z.object({
    messages: z.array(trainingMessageSchema),
})

export type TrainingMessages = z.infer<typeof trainingMessagesSchema>;

const splitContentSchema = z.array(z.object({
    text: z.string(),
    startPosition: z.number(),
}))

export type SplitContent = z.infer<typeof splitContentSchema>;

export class TrainingModule {

    static splitContentIntoSentences({content}: {content: string}): SplitContent {
        const sentences = content.split(/([.!?]+)/).filter(Boolean);
        const result: SplitContent = [];
        let position = 0;
        
        for (let i = 0; i < sentences.length; i++) {
            if (i + 1 < sentences.length && /[.!?]+/.test(sentences[i + 1])) {
                const text = (sentences[i] + sentences[i + 1]).trim();
                result.push({
                    text,
                    startPosition: position
                });
                position += sentences[i].length + sentences[i + 1].length;
                i++;
            } else if (sentences[i].trim()) {
                const text = sentences[i].trim();
                result.push({
                    text,
                    startPosition: position
                });
                position += sentences[i].length;
            }
        }
        return result;
    }

    static splitContentIntoWords({content}: {content: string}): SplitContent {
        const words: SplitContent = [];
        let position = 0;
        const matches = content.matchAll(/\S+/g);
        
        for (const match of matches) {
            words.push({
                text: match[0],
                startPosition: match.index || 0
            });
            position += match[0].length;
        }
        
        return words;
    }

    static splitContentIntoPunctuation({content}: {content: string}): SplitContent {
        const punctuation: SplitContent = [];
        let position = 0;
        const matches = content.matchAll(/[.!?\-\-]+/g);
        
        for (const match of matches) {
            punctuation.push({
                text: match[0],
                startPosition: match.index || 0
            });
            position += match[0].length;
        }
        return punctuation;
    }

    static createSentenceLevelTrainingMessagePair({content}: {content: string}): TrainingMessagePair {
        const sentences = this.splitContentIntoSentences({content});
        
        const trainingPairs: TrainingMessagePair[] = [];
        
        for (const sentence of sentences) {
            // Create content with hole by replacing current sentence with ${HOLE}
            const contentWithHole = content.replace(sentence.text, "${HOLE}");
            
            // Find start and end positions for context window
            const holePosition = sentence.startPosition;
            const contextStart = Math.max(0, holePosition - 15);
            const contextEnd = Math.min(content.length, holePosition + sentence.text.length + 15);
            
            // Create context with sentence filled in
            const beforeContext = content.substring(contextStart, holePosition);
            const afterContext = content.substring(holePosition + sentence.text.length, contextEnd);
            const filledContext = beforeContext + sentence.text + afterContext;
            
            trainingPairs.push({
                user: {
                    content: contentWithHole,
                    role: "user"
                },
                assistant: {
                    content: filledContext,
                    role: "assistant"
                }
            });
        }
        
        return trainingPairs[0]; // Return first pair for now
    }


    static createFineTuningTrainingData({title, description, content}: {title: string, description: string, content: string}) {
        const systemPrompt = `
        You are a hole filling writing assistant that fills in the missing part of the user's document. 
        The title of the document is ${title} and the description is ${description}.

        Wherever the \${HOLE} token is found, fill in the hole with your prediction of what the user would write.
        `
    }
}
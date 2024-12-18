import { CoreMessage, ExtractedText, TrainingSet, trainingSetSchema } from "@/schema";

export class TrainingModule {

    static extractWordsFromContent({content}: {content: string}): ExtractedText[] {
        const words = content.split(/\s+/).filter(Boolean);
        const result: ExtractedText[] = [];
        let position = 0;

        for (const word of words) {
            result.push({
                text: word,
                startPosition: position
            });
            position += word.length + 1;
        }
        return result;
    }

    static createTrainingSetsFromExtractedWordsAndContent({extractedWords, content}: {extractedWords: ExtractedText[], content: string}) {
        const trainingSets: TrainingSet[] = [];
        
        for (const word of extractedWords) {
            const beforePart = content.slice(0, word.startPosition);
            const afterPart = content.slice(word.startPosition + word.text.length);
            const userMessage: CoreMessage = {
                role: "user",
                content: `<user-writing>${beforePart}${"${HOLE}"}${afterPart}</user-writing> Fill in the hole in the user's writing with the 5 words before the hole and the 5 words after the hole:`
            }
            const assistantMessage: CoreMessage = {
                role: "assistant",
                // NOTE: Although the prompt says 5 words, need to put 6 to actually get 5 words
                content: beforePart.split(' ').slice(-6).join(' ') + word.text + afterPart.split(' ').slice(0, 6).join(' ')
            }
            trainingSets.push({
                messages: [userMessage, assistantMessage]
            });
        }
        return trainingSets;
    }

    static createFineTuningTrainingData({title, description, content}: {title: string, description: string, content: string}) {
        const systemPrompt = `You are a hole filling writing assistant that fills in the missing part of the user's document. The title of the document is ${title} and the description is ${description}. Wherever the \${HOLE} token is found, fill in the hole with your prediction of what the user would write.
        `

        const extractedWords = TrainingModule.extractWordsFromContent({content});
        const trainingSets = TrainingModule.createTrainingSetsFromExtractedWordsAndContent({extractedWords, content});

        for (const trainingSet of trainingSets) {
            trainingSet.messages.unshift({
                role: "system",
                content: systemPrompt
            });
        }
        return trainingSets;
    }
}
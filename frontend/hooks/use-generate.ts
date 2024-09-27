import { EditorView } from "@tiptap/pm/view";
import { useCallback } from "react";
import { generate as generateAction } from "@/actions/generations/generate";
import { GenerateOutput } from "@/packages/schema";

function getUserSelection({ view }: { view: EditorView }): string {
    const { state } = view;
    const { selection } = state;
    const { from, to } = selection;
    return view.state.doc.textBetween(from, to, " ");
}

export interface UseGenerate {
    handleGenerateOnClick: (view: EditorView, command: string) => void;
}

export function useGenerate(): UseGenerate {

    const fetchGeneration = useCallback(
        async (selection: string, command: string): Promise<string | null> => {
            try {
                const output: GenerateOutput = await generateAction(selection, command);
                return output.generation;
            } catch (error) {
                console.error("Error in fetchGeneration:", error);
                return null;
            }
        },
        [generateAction]
    );

    const generate = useCallback(async (selection: string, command: string): Promise<string> => {
        const output = await generateAction(selection, command);
        return output.generation;
    }, []);

    const handleGenerateOnClick = async (view: EditorView, command: string) => {
        const selection = getUserSelection({ view });
        const generation = await fetchGeneration(selection, command);
        if (generation) {
            view.dispatch(view.state.tr.insertText(generation));
        }
    };

    return { handleGenerateOnClick };
}

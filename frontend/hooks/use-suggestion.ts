import { useCallback, useRef, MutableRefObject, useEffect } from "react";
import { EditorView } from "@tiptap/pm/view";
import { Editor } from "@tiptap/core";
import { TextSelection, Transaction } from "@tiptap/pm/state";
import { useState } from "react";
import { diffWords } from "diff";
import { Change } from "diff";
import { useDebounce } from "@uidotdev/usehooks";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { suggest as suggestAction } from "@/actions/suggestions/suggest";
import { SuggestOutput } from "@/packages/schema";
const SUGGESTION_DEBOUNCE_TIME: number = 1000;
const SUGGESTION_LOCK_TIME: number = 3000;

export interface UseSuggestion {
  isSuggestionVisible: MutableRefObject<boolean>;
  isFetching: MutableRefObject<boolean>;
  canSuggest: boolean;
  suggest: () => Promise<void>;
  fetchSuggestion: (
    textBeforeCursor: string,
    textAfterCursor: string
  ) => Promise<string | null>;
  displaySuggestion: (editor: Editor, prediction: string) => void;
  acceptSuggestion: (view: EditorView) => void;
  rejectSuggestion: (view: EditorView) => void;
  handleCreate: ({ editor }: { editor: Editor }) => void;
  handleKeyDown: (view: EditorView, event: KeyboardEvent) => void;
  handleSelectionChange: ({
    editor,
    transaction,
  }: {
    editor: Editor;
    transaction: Transaction;
  }) => void;
}

interface TextBeforeAndAfterCursor {
  textBeforeCursor: string;
  textAfterCursor: string;
}

function getTextBeforeAndAfterCursor(
  view: EditorView
): TextBeforeAndAfterCursor {
  const { state } = view;
  const { selection } = state;
  const { to } = selection;
  const docLength = view.state.doc.content.size;
  return {
    textBeforeCursor: view.state.doc.textBetween(0, to),
    textAfterCursor: view.state.doc.textBetween(to, docLength),
  };
}

export function useSuggestion(): UseSuggestion {
  const _editor = useRef<Editor | null>(null);
  const isFetching = useRef<boolean>(false);
  const isSuggestionVisible = useRef<boolean>(false);
  const [isSuggestionLocked, setIsSuggestionLocked] = useState<boolean>(false);
  const canSuggest = useDebounce(
    !isSuggestionLocked,
    !isSuggestionLocked ? SUGGESTION_LOCK_TIME : 0
  );
  const [selectionPosition, setSelectionPosition] = useState<number | null>(
    null
  );
  const predictTrigger = useDebounce(
    selectionPosition,
    SUGGESTION_DEBOUNCE_TIME
  );

  useEffect(() => {
    predict();
  }, [predictTrigger]);

  const predict = useCallback(async () => {
    if (!canSuggest || isSuggestionVisible.current || !_editor.current) return;
    const { textBeforeCursor, textAfterCursor } = getTextBeforeAndAfterCursor(
      _editor.current.view
    );
    const suggestion: string | null = await fetchSuggestion(
      textBeforeCursor,
      textAfterCursor
    );
    if (suggestion) {
      displaySuggestion(_editor.current, suggestion);
    }
  }, []);

  const fetchSuggestion = useCallback(
    async (
      textBeforeCursor: string,
      textAfterCursor: string
    ): Promise<string | null> => {
      if (isFetching.current || !canSuggest) return null;
      isFetching.current = true;
      const suggestion: SuggestOutput | null = await suggestAction(
        textBeforeCursor,
        textAfterCursor
      );
      isFetching.current = false;
      console.log(suggestion);
      const suggestionText =
        suggestion?.words_before_suggestion +
        suggestion?.suggestion +
        suggestion?.words_after_suggestion;
      return suggestionText ?? null;
    },
    []
  );

  const diffSuggestionParts = useCallback(
    (currentText: string, suggestion: string): Change[] => {
      console.log(currentText);
      console.log(suggestion);
      const parts: Change[] = diffWords(currentText, suggestion);
      // Remove the first part if it's a removal
      if (parts[0].removed) {
        parts.shift();
      }
      // If the first part is an addition, interpret the
      return parts;
    },
    []
  );

  const displaySuggestion = useCallback(
    (editor: Editor, suggestion: string) => {
      if (isSuggestionVisible.current) return;
      const { state } = editor.view;
      const { selection } = state;
      const { from } = selection;

      // Get the current text from the cursor position to the end of the document
      const currentText = state.doc.textBetween(0, state.doc.content.size);
      const parts: Change[] = diffSuggestionParts(currentText, suggestion);

      console.log(parts);

      let insertPosition = from;
      let predictionContent = "";

      for (const change of parts) {
        if (change.added) {
          predictionContent += change.value;
        } else if (change.removed) {
          insertPosition += change.count ?? 0;
        }
      }

      if (predictionContent.length > 0) {
        editor
          .chain()
          .insertContentAt(insertPosition, {
            type: "suggestion",
            attrs: {
              prediction: predictionContent,
            },
          })
          .setTextSelection(insertPosition)
          .run();
        isSuggestionVisible.current = true;
        setIsSuggestionLocked(true);
      }
    },
    []
  );

  const acceptSuggestion = useCallback((view: EditorView) => {
    // Converts any displayed predictions into regular text
    console.log("acceptSuggestion");
    if (!isSuggestionVisible.current) return;
    view.state.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.type.name === "prediction") {
        const tr = view.state.tr;
        const predictionText = node.attrs.prediction;
        tr.replaceWith(
          pos,
          pos + node.nodeSize,
          view.state.schema.text(predictionText)
        );
        tr.setSelection(
          TextSelection.create(tr.doc, pos + predictionText.length)
        );
        view.dispatch(tr);
      }
    });
    isSuggestionVisible.current = false;
    setIsSuggestionLocked(true);
  }, []);

  const rejectSuggestion = useCallback((view: EditorView) => {
    console.log("rejectSuggestion");
    // Removes all displayed predictions
    if (!_editor.current) return;
    const tr = view.state.tr;
    view.state.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.type.name === "prediction") {
        tr.delete(pos, pos + node.nodeSize);
      }
    });
    view.dispatch(tr);
    isSuggestionVisible.current = false;
    setIsSuggestionLocked(true);
  }, []);

  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      // const { state } = view;
      if (isSuggestionVisible.current) {
        switch (event.key) {
          case "Tab":
            event.preventDefault();
            console.log("Tab pressed -- accept suggestion");
            return acceptSuggestion(view);
          case "Backspace":
            event.preventDefault();
            console.log("Backspace pressed -- reject suggestion");
            return rejectSuggestion(view);
          default:
            console.log("Default -- reject suggestion");
            return rejectSuggestion(view);
        }
      }
    },
    []
  );

  const handleSelectionChange = useCallback(
    async ({ editor }: { editor: Editor }) => {
      // TODO: Check UX and performance implications of not checking
      // if prediction is allowed before setting selection position
      if (isSuggestionVisible.current) {
        console.log(
          "rejectSuggestion because selection changed while suggestion is visible"
        );
        rejectSuggestion(editor.view);
      }
      // Prevent setting selection position if the selection is a highlight
      setSelectionPosition(editor.view.state.selection.anchor);
    },
    []
  );

  const handleCreate = useCallback(({ editor }: { editor: Editor }) => {
    console.log("handleCreate");
    _editor.current = editor;
  }, []);

  return {
    isFetching,
    isSuggestionVisible: isSuggestionVisible,
    canSuggest: canSuggest,
    suggest: predict,
    fetchSuggestion,
    displaySuggestion,
    acceptSuggestion,
    rejectSuggestion,
    handleKeyDown,
    handleSelectionChange,
    handleCreate,
  };
}

import { useCallback, useRef, MutableRefObject, useEffect } from "react";
import { EditorView } from "@tiptap/pm/view";
import { Editor } from "@tiptap/core";
import { TextSelection, Transaction } from "@tiptap/pm/state";
import { useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { suggest as suggestAction } from "@/actions/suggestions/suggest";
import { SuggestOutput } from "@/packages/schema";

const SUGGESTION_DEBOUNCE_TIME: number = 1000;
const SUGGESTION_LOCK_TIME: number = 3000;
const SUGGESTION_CONTEXT_LENGTH: number = 1000;

export interface UseSuggest {
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


function isAtEndOfDocument(anchor: number, doc: ProseMirrorNode): boolean {
  console.log("isAtEndOfDocument", anchor, doc.content.size);
  return anchor === doc.content.size || doc.textBetween(anchor, doc.content.size).trim() === '';
}

function isAfterNewline(anchor: number, doc: ProseMirrorNode): boolean {
  console.log("isAfterNewline", anchor, doc.textBetween(anchor - 1, anchor));
  return anchor > 0 && doc.textBetween(anchor - 1, anchor) === "";
}

function getTextBeforeAndAfterCursor(
  view: EditorView
): TextBeforeAndAfterCursor {
  const { state } = view;
  const { selection } = state;
  const { to } = selection;
  const docLength = view.state.doc.content.size;
  const start = Math.max(0, to - (SUGGESTION_CONTEXT_LENGTH / 2));
  const end = Math.min(docLength, to + (SUGGESTION_CONTEXT_LENGTH / 2));
  return {
    textBeforeCursor: view.state.doc.textBetween(start, to),
    textAfterCursor: view.state.doc.textBetween(to, end),
  };
}

export function useSuggest(): UseSuggest {
  const _editor = useRef<Editor | null>(null);
  const isFetching = useRef<boolean>(false);
  const isSuggestionVisible = useRef<boolean>(false);
  const [isSuggestionLocked, setIsSuggestionLocked] = useState<boolean>(false);
  const canSuggest = useDebounce(
    !isSuggestionLocked,
    !isSuggestionLocked ? SUGGESTION_LOCK_TIME : 0
  );
  const [triggerSuggestAtAnchorPosition, setTriggerSuggestAtAnchorPosition] = useState<number | null>(
    null
  );
  const suggestTrigger = useDebounce(
    triggerSuggestAtAnchorPosition,
    SUGGESTION_DEBOUNCE_TIME
  );

  useEffect(() => {
    suggest();
  }, [suggestTrigger]);

  const suggest = useCallback(async () => {
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
      return suggestion?.next_words ?? null;
    },
    []
  );

  const displaySuggestion = useCallback(
    (editor: Editor, suggestion: string) => {
      if (isSuggestionVisible.current) return;
      const { state } = editor.view;
      const { selection } = state;
      const { from } = selection;
      editor
        .chain()
        .insertContentAt(from, {
          type: "suggestion",
          attrs: {
            suggestion: suggestion,
          },
        })
        .setTextSelection(from)
        .run();
      isSuggestionVisible.current = true;
      setIsSuggestionLocked(true);
    },
    []
  );

  const acceptSuggestion = useCallback((view: EditorView) => {
    // Converts any displayed predictions into regular text
    if (!isSuggestionVisible.current) return;
    view.state.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.type.name === "suggestion") {
        const tr = view.state.tr;
        const suggestionText = node.attrs.suggestion;
        tr.replaceWith(
          pos,
          pos + node.nodeSize,
          view.state.schema.text(suggestionText)
        );
        tr.setSelection(
          TextSelection.create(tr.doc, pos + suggestionText.length)
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
      if (node.type.name === "suggestion") {
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
      console.log("handleSelectionChange");
      if (isSuggestionVisible.current) {
        console.log(
          "rejectSuggestion because selection changed while suggestion is visible"
        );
        rejectSuggestion(editor.view);
      }

      const { state } = editor.view;
      const { selection, doc } = state;
      const { anchor } = selection;
      // Only trigger if we're at the end of the document or after a newline
      if (isAtEndOfDocument(anchor, doc) || isAfterNewline(anchor, doc)) {
        console.log("setTriggerSuggestAtAnchorPosition", anchor);
        setTriggerSuggestAtAnchorPosition(anchor);
      }
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
    suggest: suggest,
    fetchSuggestion,
    displaySuggestion,
    acceptSuggestion,
    rejectSuggestion,
    handleKeyDown,
    handleSelectionChange,
    handleCreate,
  };
}

import { useCallback, useRef, MutableRefObject, useEffect } from "react";
import { EditorView } from "@tiptap/pm/view";
import { Editor } from "@tiptap/core";
import { TextSelection, Transaction } from "@tiptap/pm/state";
import { useState } from "react";
import { diffWords } from "diff";
import { Change } from "diff";
import { useDebounce } from "@uidotdev/usehooks";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { predict as predictAction } from "@/actions/predictions/predict";
const PREDICTION_DEBOUNCE_TIME: number = 1000;
const PREDICTION_LOCK_TIME: number = 3000;

export interface UsePrediction {
  isPredictionVisible: MutableRefObject<boolean>;
  isFetching: MutableRefObject<boolean>;
  canPredict: boolean;
  predict: () => Promise<void>;
  fetchPrediction: (
    textBeforeCursor: string,
    textAfterCursor: string
  ) => Promise<string | null>;
  displayPrediction: (editor: Editor, prediction: string) => void;
  acceptPrediction: (view: EditorView) => void;
  rejectPrediction: (view: EditorView) => void;
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

export function usePrediction(): UsePrediction {
  const _editor = useRef<Editor | null>(null);
  const isFetching = useRef<boolean>(false);
  const isPredictionVisible = useRef<boolean>(false);
  const [isPredictionLocked, setIsPredictionLocked] = useState<boolean>(false);
  const canPredict = useDebounce(
    !isPredictionLocked,
    !isPredictionLocked ? PREDICTION_LOCK_TIME : 0
  );
  const [selectionPosition, setSelectionPosition] = useState<number | null>(
    null
  );
  const predictTrigger = useDebounce(
    selectionPosition,
    PREDICTION_DEBOUNCE_TIME
  );

  useEffect(() => {
    predict();
  }, [predictTrigger]);

  const predict = useCallback(async () => {
    if (!canPredict || isPredictionVisible.current || !_editor.current) return;
    const { textBeforeCursor, textAfterCursor } = getTextBeforeAndAfterCursor(
      _editor.current.view
    );
    const prediction: string | null = await fetchPrediction(
      textBeforeCursor,
      textAfterCursor
    );
    if (prediction) {
      displayPrediction(_editor.current, prediction);
    }
  }, []);

  const fetchPrediction = useCallback(
    async (
      textBeforeCursor: string,
      textAfterCursor: string
    ): Promise<string | null> => {
      if (isFetching.current || !canPredict || isPredictionVisible.current)
        return null;
      isFetching.current = true;
      const prediction: string | null = await predictAction(
        textBeforeCursor,
        textAfterCursor
      );
      isFetching.current = false;
      return prediction;
    },
    []
  );
  const displayPrediction = useCallback(
    (editor: Editor, prediction: string) => {
      if (isPredictionVisible.current) return;
      const { state } = editor.view;
      const { selection } = state;
      const { from } = selection;

      // Get the current text from the cursor position to the end of the document
      const currentText = state.doc.textBetween(0, state.doc.content.size);
      console.log(currentText);
      console.log(prediction);
      const parts: Change[] = diffWords(currentText, prediction);

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
            type: "prediction",
            attrs: {
              prediction: predictionContent,
            },
          })
          .setTextSelection(insertPosition)
          .run();
        isPredictionVisible.current = true;
        setIsPredictionLocked(true);
      }
    },
    []
  );

  const acceptPrediction = useCallback((view: EditorView) => {
    // Converts any displayed predictions into regular text
    if (!isPredictionVisible.current) return;
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
    isPredictionVisible.current = false;
    setIsPredictionLocked(true);
  }, []);

  const rejectPrediction = useCallback((view: EditorView) => {
    // Removes all displayed predictions
    if (!_editor.current) return;
    const tr = view.state.tr;
    view.state.doc.descendants((node: ProseMirrorNode, pos: number) => {
      if (node.type.name === "prediction") {
        tr.delete(pos, pos + node.nodeSize);
      }
    });
    view.dispatch(tr);
    isPredictionVisible.current = false;
    setIsPredictionLocked(true);
  }, []);

  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      // const { state } = view;
      if (isPredictionVisible.current) {
        switch (event.key) {
          case "Tab":
            event.preventDefault();
            return acceptPrediction(view);
          case "Backspace":
            event.preventDefault();
            return rejectPrediction(view);
          default:
            return rejectPrediction(view);
        }
      }
    },
    []
  );

  const handleSelectionChange = useCallback(
    async ({ editor }: { editor: Editor }) => {
      // TODO: Check UX and performance implications of not checking
      // if prediction is allowed before setting selection position
      if (isPredictionVisible.current) {
        rejectPrediction(editor.view);
      }
      // Prevent setting selection position if the selection is a highlight
      setSelectionPosition(editor.view.state.selection.anchor);
    },
    []
  );

  const handleCreate = useCallback(({ editor }: { editor: Editor }) => {
    _editor.current = editor;
  }, []);

  return {
    isFetching,
    isPredictionVisible,
    canPredict,
    predict,
    fetchPrediction,
    displayPrediction,
    acceptPrediction,
    rejectPrediction,
    handleKeyDown,
    handleSelectionChange,
    handleCreate,
  };
}

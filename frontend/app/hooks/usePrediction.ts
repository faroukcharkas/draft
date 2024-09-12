import { useCallback, useRef, MutableRefObject } from "react";
import { EditorView } from "@tiptap/pm/view";
import { Editor } from "@tiptap/core";
import { Transaction } from "@tiptap/pm/state";
import debounce from "lodash.debounce";
import { PredictRequest } from "@pentip/schema";

const PREDICTION_DEBOUNCE_TIME: number = 1000;
// const PREDICTION_LOCK_TIME: number = 3000;

export interface PredictionHook {
  isPredictionVisible: MutableRefObject<boolean>;
  isFetching: MutableRefObject<boolean>;
  predict: (view: EditorView) => void;
  fetchPrediction: (
    textBeforeCursor: string,
    textAfterCursor: string
  ) => Promise<string>;
  displayPrediction: (view: EditorView) => void;
  acceptPrediction: (view: EditorView) => void;
  rejectPrediction: (view: EditorView) => void;
  handleKeyDown: (view: EditorView, event: KeyboardEvent) => void;
  handleSelectionChange: (editor: Editor, transaction: Transaction) => void;
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

export function usePrediction(): PredictionHook {
  const isFetching = useRef<boolean>(false);
  const isPredictionVisible = useRef<boolean>(false);
  // const isPredictionLocked = useRef<boolean>(false);
  // const canPredict = useRef(
  //   debounce(
  //     (value: boolean) => {
  //       isPredictionLocked.current = value;
  //     },
  //     isPredictionLocked.current ? 0 : PREDICTION_LOCK_TIME
  //   )
  // );

  const predict = useCallback(
    debounce((view: EditorView) => {
      const predictRequest: PredictRequest = getTextBeforeAndAfterCursor(view);

      fetchPrediction(
        predictRequest.textBeforeCursor,
        predictRequest.textAfterCursor
      );
    }, PREDICTION_DEBOUNCE_TIME),
    [debounce]
  );

  const fetchPrediction = useCallback(
    async (textBeforeCursor: string, textAfterCursor: string) => {
      if (isFetching.current) return;
      isFetching.current = true;
      const response = await fetch("/api/prediction", {
        method: "POST",
        body: JSON.stringify({ textBeforeCursor, textAfterCursor }),
      });
      const data = await response.json();
      isFetching.current = false;
      return data.prediction;
    },
    []
  );

  const displayPrediction = useCallback((view: EditorView) => {
    view;
    // const { dispatch } = view;
  }, []);

  const acceptPrediction = useCallback((view: EditorView) => {
    view;
    // const { dispatch } = view;
  }, []);

  const rejectPrediction = useCallback((view: EditorView) => {
    view;
    // const { dispatch } = view;
  }, []);

  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      // const { state } = view;
      if (isPredictionVisible.current) {
        switch (event.key) {
          case "Tab":
            return acceptPrediction(view);
          case "Backspace":
            return rejectPrediction(view);
          default:
            return rejectPrediction(view);
        }
      }
    },
    []
  );

  const handleSelectionChange = useCallback(
    (editor: Editor, transaction: Transaction) => {
      const { state } = editor;
      transaction;
      console.log(state.selection);
    },
    []
  );

  return {
    isFetching,
    isPredictionVisible,
    predict,
    fetchPrediction,
    displayPrediction,
    acceptPrediction,
    rejectPrediction,
    handleKeyDown,
    handleSelectionChange,
  };
}

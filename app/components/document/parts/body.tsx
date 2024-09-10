"use client";
import { EditorProvider } from "@tiptap/react";
import { useState, useCallback, useRef } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import debounce from "lodash.debounce";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Prediction } from "./prediction";
import { EditorView } from "@tiptap/pm/view";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Write something...",
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] opacity-50 before:absolute before-pointer-events-none",
  }),
  Prediction,
];

async function getPrediction(currentText: string) {
  if (!currentText || currentText.length === 0) return "";
  const response = await fetch("/api/prediction", {
    method: "POST",
    body: JSON.stringify({ text: currentText }),
  });
  const data = await response.json();
  return data.prediction;
}

export function DocumentBody() {
  const [activePrediction, setActivePrediction] = useState<{
    startingPosition: number;
    prediction: string;
  } | null>(null);
  const [predictionLock, setPredictionLock] = useState(false);
  const canGeneratePrediction = useDebounce(
    !predictionLock,
    predictionLock ? 0 : 3000
  );

  const isUpdatingRef = useRef(false);
  const debouncedGeneratePrediction = useCallback(
    debounce((view: EditorView, state: EditorState) => {
      generatePrediction(view, state, view.state.doc.textContent);
    }, 1000),
    []
  );

  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      const { state } = view;
      if (activePrediction) {
        switch (event.key) {
          case "Tab":
            // Accept the prediction
            return acceptPrediction(view, state);
          case "Backspace":
            // Remove the prediction, and don't generate a new one
            return rejectPrediction(view, state);
          default:
            // If the person is typing the same character as the prediction starts with, "fill in" the prediction
            // Otherwise, delete the prediction
            if (
              event.key.length === 1 &&
              activePrediction.prediction.startsWith(event.key)
            ) {
              return fillPrediction(view, state);
            }
            return rejectPrediction(view, state);
        }
      } else {
        // Generate new prediction
        if (
          !isUpdatingRef.current &&
          !event.ctrlKey &&
          !event.metaKey &&
          event.key.length === 1 &&
          canGeneratePrediction
        ) {
          debouncedGeneratePrediction(view, state);
        }
      }
      setPredictionLock(false);
      return false;
    },
    [
      activePrediction,
      isUpdatingRef,
      predictionLock,
      canGeneratePrediction,
      debouncedGeneratePrediction,
    ]
  );

  function acceptPrediction(view: EditorView, state: EditorState) {
    const { dispatch } = view;
    if (!activePrediction) return false;

    const predStartPos = activePrediction.startingPosition;
    let predictionNodeSize = 0;
    state.doc.nodesBetween(
      predStartPos,
      state.doc.content.size,
      (node: ProseMirrorNode, pos: number) => {
        if (node.type.name === "prediction") {
          predictionNodeSize = node.nodeSize;
          return false;
        }
      }
    );
    if (predictionNodeSize > 0) {
      dispatch(
        state.tr
          .delete(predStartPos, predStartPos + predictionNodeSize)
          .insertText(activePrediction.prediction, predStartPos)
      );
    }

    setActivePrediction(null);
    setPredictionLock(true); // Author accepted prediction, give them some time before generating again
    return true;
  }

  function rejectPrediction(view: EditorView, state: EditorState) {
    const { dispatch } = view;
    if (!activePrediction) return false;

    const predStartPos = activePrediction.startingPosition;
    let predictionNodeSize = 0;
    state.doc.nodesBetween(
      predStartPos,
      state.doc.content.size,
      (node: ProseMirrorNode, pos: number) => {
        if (node.type.name === "prediction") {
          predictionNodeSize = node.nodeSize;
          return false;
        }
      }
    );
    if (predictionNodeSize > 0) {
      dispatch(
        state.tr.delete(predStartPos, predStartPos + predictionNodeSize)
      );
    }

    setActivePrediction(null);
    setPredictionLock(true); // Author rejected prediction, give them some time before generating again
    return true;
  }

  function fillPrediction(view: EditorView, state: EditorState) {
    const { dispatch } = view;
    if (!activePrediction) return false;
    const predStartPos = activePrediction.startingPosition;
    const predEndPos = predStartPos + activePrediction.prediction.length;
    state.doc.nodesBetween(
      predStartPos,
      predEndPos,
      (node: ProseMirrorNode, pos: number) => {
        if (node.type.name === "prediction") {
          dispatch(
            state.tr
              .deleteRange(pos, pos + node.nodeSize)
              .insertText(node.attrs.prediction, pos)
          );
          setActivePrediction(null);
          return false;
        }
      }
    );
    return true;
  }

  function overlayPrediction(
    currentText: string,
    prediction: string
  ): { prediction: string; overlayed: boolean } {
    console.log(currentText, prediction);
    const trimmedPrediction = prediction.trim().startsWith(currentText)
      ? prediction.slice(currentText.length).trim()
      : prediction;
    console.log(trimmedPrediction);
    if (trimmedPrediction.length > 0) {
      return { prediction: trimmedPrediction, overlayed: true };
    }
    return { prediction: "", overlayed: false };
  }

  function insertPrediction(
    view: EditorView,
    state: EditorState,
    prediction: string,
    overlayed: boolean
  ) {
    isUpdatingRef.current = true;
    const offset = overlayed ? 1 : 0;
    const pos = state.selection.to;
    const predictionNode = view.state.schema.nodes.prediction.create({
      prediction: prediction,
    });
    view.dispatch(view.state.tr.insert(pos + offset, predictionNode));
    setActivePrediction({
      startingPosition: pos + offset,
      prediction: prediction,
    });
    isUpdatingRef.current = false; // Update the ref after inserting prediction
  }

  function generatePrediction(
    view: EditorView,
    state: EditorState,
    currentText: string
  ) {
    isUpdatingRef.current = true;
    getPrediction(currentText.trim()).then((prediction) => {
      if (prediction.length > 0) {
        const { prediction: overlayedPrediction, overlayed } =
          overlayPrediction(currentText, prediction);
        insertPrediction(view, state, overlayedPrediction, overlayed);
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <EditorProvider
        extensions={extensions}
        immediatelyRender={false}
        editorProps={{
          attributes: {
            class:
              "text-lg w-full h-full p-0 border-none outline-none bg-transparent",
          },
          handleKeyDown,
        }}
      ></EditorProvider>
    </div>
  );
}

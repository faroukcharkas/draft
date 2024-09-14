"use client";
import { EditorProvider } from "@tiptap/react";
import { useState, useCallback, useRef, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import debounce from "lodash.debounce";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Prediction } from "./prediction";
import { EditorView } from "@tiptap/pm/view";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";
import { EditorState } from "@tiptap/pm/state";
import { ToolBar } from "./tool-bar/tool-bar";
import { TextSelection } from "@tiptap/pm/state";
import { Json } from "@/packages/schema";
import { usePrediction } from "@/hooks/use-prediction";
import { Content } from "@tiptap/react";
import { saveDocumentBody } from "../../../../actions/document/save";
const extensions = [
  StarterKit,
  Underline,
  Placeholder.configure({
    placeholder: "Write something...",
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] opacity-50 before:absolute before-pointer-events-none",
  }),
  Prediction,
  TextAlign.configure({
    types: ["paragraph"],
  }),
];
export function DocumentBody({
  initialBody,
  documentId,
}: {
  initialBody: Json | null;
  documentId: string;
}) {
  const [content, setContent] = useState<Content | undefined>(
    initialBody as Content
  );
  const debouncedContent = useDebounce(content, 5000);

  // const {
  //   isFetching,
  //   isPredictionVisible,
  //   predict,
  //   fetchPrediction,
  //   displayPrediction,
  //   acceptPrediction,
  //   rejectPrediction,
  //   handleKeyDown,
  //   handleSelectionChange,
  // } = usePrediction();

  useEffect(() => {
    if (debouncedContent) {
      console.log("Saving document content", documentId, debouncedContent);
      const plainContent = JSON.parse(JSON.stringify(debouncedContent));
      saveDocumentBody(documentId, plainContent);
    }
  }, [debouncedContent, documentId]);

  return (
    <div className="flex flex-1 flex-col h-full">
      <EditorProvider
        extensions={extensions}
        content={content}
        immediatelyRender={false}
        slotBefore={<ToolBar />}
        editorProps={{
          attributes: {
            class:
              "text-lg w-full h-full p-0 border-none outline-none bg-transparent",
          },
          // handleKeyDown,
        }}
        onUpdate={(data) => {
          console.log("Editor content updated", data);
          setContent(data.editor.getJSON());
        }}
        // onSelectionUpdate={handleSelectionChange}
      ></EditorProvider>
    </div>
  );
}

"use client";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Prediction } from "./prediction";
import InlineMenu from "./inline-menu/inline-menu";
import { ToolBar } from "./tool-bar/tool-bar";
import { Json } from "@/packages/schema";
import { usePrediction } from "@/hooks/use-prediction";
import { Content } from "@tiptap/react";
import { useAutosave } from "@/hooks/use-autosave";
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
  const { content, handleUpdate } = useAutosave({
    initialContent: initialBody,
    documentId,
  });
  const { handleKeyDown, handleSelectionChange, canPredict, handleCreate } =
    usePrediction();

  return (
    <div className="flex flex-1 flex-col h-full">
      <EditorProvider
        extensions={extensions}
        content={content as Content}
        immediatelyRender={false}
        slotBefore={<ToolBar />}
        editorProps={{
          attributes: {
            class:
              "text-lg w-full h-full p-0 border-none outline-none bg-transparent",
          },
          handleKeyDown,
        }}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
        onSelectionUpdate={handleSelectionChange}
      >
        <InlineMenu />
      </EditorProvider>
    </div>
  );
}

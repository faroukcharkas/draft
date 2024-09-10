"use client";
import { EditorProvider } from "@tiptap/react";
import { useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Tip } from "./tip";
import { Editor } from "@tiptap/core";

const extensions = [
  StarterKit,
  Placeholder.configure({
    placeholder: "Write something...",
    emptyEditorClass:
      "cursor-text before:content-[attr(data-placeholder)] opacity-50 before:absolute before-pointer-events-none",
  }),
  Tip,
];

async function getTip(currentText: string) {
  if (!currentText || currentText.length === 0) return "";
  const response = await fetch("/api/tip", {
    method: "POST",
    body: JSON.stringify({ text: currentText }),
  });
  const data = await response.json();
  return data.tip;
}

export function DocumentBody() {
  const [tipShown, setTipShown] = useState(false);
  const isUpdatingRef = useRef(false);

  const debouncedHandleUpdate = useCallback(
    debounce(({ editor }: { editor: Editor }) => {
      if (tipShown || isUpdatingRef.current) return;
      setTipShown(true);
      console.log("debouncedGetTip", editor.getText());
      getTip(editor.getText()).then((tip) => {
        isUpdatingRef.current = true;
        editor
          .chain()
          .focus()
          .insertContent({
            type: "tip",
            attrs: { tip: tip },
          })
          .run();
        isUpdatingRef.current = false;
      });
    }, 500),
    []
  );

  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (!isUpdatingRef.current) {
        debouncedHandleUpdate({ editor });
      }
    },
    [debouncedHandleUpdate]
  );

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
          handleDOMEvents: {
            keydown: (view, event) => {
              console.log("keydown", event);
              return false;
            },
          },
        }}
        onUpdate={handleUpdate}
      ></EditorProvider>
    </div>
  );
}

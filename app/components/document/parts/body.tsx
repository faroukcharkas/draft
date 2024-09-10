"use client";
import { EditorProvider } from "@tiptap/react";
import { useState, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Tip } from "./tip";
import { Editor } from "@tiptap/core";
import { EditorView } from "@tiptap/pm/view";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

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
  const [activeTip, setActiveTip] = useState<{
    pos: number;
    tip: string;
  } | null>(null);
  const isUpdatingRef = useRef(false);

  const debouncedHandleUpdate = useCallback(
    debounce(({ editor }: { editor: Editor }) => {
      if (activeTip || isUpdatingRef.current) return;
      console.log("debouncedGetTip", editor.getText());
      getTip(editor.getText()).then((tip) => {
        if (tip.length === 0) return;
        const editorText = editor.getText();
        const trimmedTip = tip.trim().startsWith(editorText)
          ? tip.slice(editorText.length).trim()
          : tip;
        if (trimmedTip.length === 0) return;
        isUpdatingRef.current = true;
        const pos = editor.state.selection.to;
        editor
          .chain()
          .insertContent({
            type: "tip",
            attrs: { tip: trimmedTip },
          })
          .run();
        setActiveTip({ pos, tip: trimmedTip });
        isUpdatingRef.current = false;
      });
    }, 500),
    [activeTip]
  );

  const handleUpdate = useCallback(
    ({ editor }: { editor: Editor }) => {
      if (!isUpdatingRef.current) {
        if (activeTip) {
          const currentPos = editor.state.selection.to;
          if (
            currentPos < activeTip.pos ||
            currentPos > activeTip.pos + activeTip.tip.length
          ) {
            // Remove the active tip if cursor moves outside its range
            editor
              .chain()
              .setTextSelection(activeTip.pos)
              .deleteRange({
                from: activeTip.pos,
                to: activeTip.pos + activeTip.tip.length,
              })
              .run();
            setActiveTip(null);
          }
        } else {
          debouncedHandleUpdate({ editor });
        }
      }
    },
    [debouncedHandleUpdate, activeTip]
  );
  const handleKeyDown = useCallback(
    (view: EditorView, event: KeyboardEvent) => {
      if (event.key === "Tab" && activeTip) {
        const { state } = view;
        const tipNodes: { node: ProseMirrorNode; pos: number }[] = [];
        state.doc.descendants((node, pos) => {
          if (node.type.name === "tip") {
            tipNodes.push({ node, pos });
          }
          return true;
        });

        if (tipNodes.length > 0) {
          const { node, pos } = tipNodes[0];
          const endPos = pos + node.nodeSize;
          if (pos >= 0 && endPos <= state.doc.content.size) {
            view.dispatch(
              state.tr.deleteRange(pos, endPos).insertText(node.attrs.tip, pos)
            );
            setActiveTip(null);
            return true;
          }
        }
      } else if (activeTip) {
        // Remove the active tip on any key press other than Tab
        const { state } = view;
        const startPos = activeTip.pos;
        const endPos = activeTip.pos + activeTip.tip.length;
        if (startPos >= 0 && endPos <= state.doc.content.size) {
          view.dispatch(state.tr.deleteRange(startPos, endPos));
          setActiveTip(null);
          return true;
        }
      }
      return false;
    },
    [activeTip]
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
            keydown: handleKeyDown,
          },
        }}
        onUpdate={handleUpdate}
      ></EditorProvider>
    </div>
  );
}

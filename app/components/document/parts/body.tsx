"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { createEditor, Descendant, Node, Transforms, Element } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import Tip from "./tip";
import { motion } from "framer-motion";
import { DraftSerialization } from "@/packages/document";
import { DocumentElement, TipElement } from "@/packages/document/src/types";
import { RenderElementProps } from 'slate-react';

function RenderDraftElement({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'tip':
      return <Tip element={element} attributes={attributes}>{children}</Tip>
    case 'paragraph':
      return (
        <motion.p
          {...attributes}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.p>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

function insertTip(editor: ReactEditor, text: string) {
  const tip: TipElement = {
    type: 'tip',
    children: [
      {text: ""}
    ],
    tip: text
  }
  Transforms.insertNodes(editor, tip)
}

function withTips(editor: ReactEditor) {
  const { isInline, isVoid } = editor

  editor.isInline = (element: Element) => {
    return (element as DocumentElement).type === 'tip' ? true : isInline(element)
  }

  editor.isVoid = (element: Element) => {
    return (element as DocumentElement).type === 'tip' ? true : isVoid(element)
  }

  return editor
}

async function getTip({ currentText }: { currentText: string }) {
  if (currentText.length === 0) return "";
  const response = await fetch("/api/tip", {
    method: "POST",
    body: JSON.stringify({ currentText }),
  });
  const data = await response.json();
  return data.tip;
}

export function DocumentBody() {
  // Editor
  const renderElement = useCallback((props: RenderElementProps) => <RenderDraftElement {...props} />, [])
  const editor = useMemo(() => withTips(withReact(withHistory(createEditor()))), [])

  // Value
  const [value, setValue] = useState<Descendant[]>([{ type: 'paragraph', children: [{ text: '' }] }]);
  const debouncedValue = useDebounce(value, 1000);

  // Tip
  const [tip, setTip] = useState<string | null>(null);
  const [isTipVisible, setIsTipVisible] = useState(false);

  const clearTip = useCallback(() => {
    if (tip) {
      setTip(null);
      Transforms.removeNodes(editor, { 
        match: (node: Node) => Element.isElement(node) && node.type === 'tip',
        mode: 'highest'
      });
      setIsTipVisible(false);
    }
  }, [editor, tip]);

  const showTip = useCallback((newTip: string) => {
    if (newTip.length === 0 || newTip === tip) return;
    if (isTipVisible) {
      clearTip();
    }
    insertTip(editor, newTip);
    setTip(newTip);
    setIsTipVisible(true);
  }, [editor, isTipVisible, tip, clearTip]);

  const acceptTip = useCallback(() => {
    if (tip) {
      Transforms.insertText(editor, tip);
      clearTip();
    }
  }, [editor, tip, clearTip]);

  useEffect(() => {
    if (isTipVisible) return;

    const currentText = DraftSerialization.serializeNodesToText(debouncedValue);

    console.log("Current text", currentText);
    getTip({ currentText }).then(showTip);
  }, [debouncedValue, isTipVisible, showTip]);

  const onChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue);
    console.log("Value changed", newValue);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && tip) {
      event.preventDefault();
      acceptTip();
    } else {
      clearTip();
    }
  }, [tip, acceptTip, clearTip]);

  return (
    <div className="flex flex-1 flex-col h-full">
      <Slate editor={editor} initialValue={value} onChange={onChange}>
        <Editable
          placeholder="Write something..."
          className="text-lg w-full h-full p-0 border-none outline-none bg-transparent"
          renderElement={renderElement}
          onKeyDown={onKeyDown}
        />
      </Slate>
    </div>
  );
}

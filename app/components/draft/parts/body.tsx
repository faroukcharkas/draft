"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { createEditor, Descendant, Node, Transforms, Element } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import Tip from "./tip";
import { motion } from "framer-motion";
import { DraftSerialization } from "@pentip/draft";
import { DraftElement, DraftNode, TipElement } from "@pentip/draft/src/types";

import { RenderElementProps } from 'slate-react';

interface RenderDraftElementProps extends RenderElementProps {
  element: DraftElement;
}

function RenderDraftElement({ attributes, children, element }: RenderDraftElementProps) {
  switch (element.type) {
    case 'tip':
      return <Tip attributes={attributes}>{children}</Tip>
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
      console.log("Unknown element type", element.type);
      return <span {...attributes}>{children}</span>
  }
}

function insertTip(editor: ReactEditor, text: string) {
  console.log("Inserting tip", text);
  const tip: TipElement = {
    type: 'tip',
    children: [
      { text: text }
    ],
  }
  
  Transforms.insertNodes(editor, tip)
  console.log("Tip inserted (from insertTip)");
}

function withTips(editor: ReactEditor) {
  const { isInline, isVoid } = editor

  editor.isInline = (element: Element) => {
    return (element as DraftElement).type === 'tip' ? true : isInline(element)
  }

  editor.isVoid = (element: Element) => {
    return (element as DraftElement).type === 'tip' ? true : isVoid(element)
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

export function DraftBody() {
  // Editor
  const renderElement = useCallback((props: any) => <RenderDraftElement {...props} />, [])
  const editor = useMemo(() => withTips(withReact(withHistory(createEditor()))), [])

  // Value
  const [value, setValue] = useState<DraftNode[]>([{ type: 'paragraph', children: [{ text: '' }] }]);
  const debouncedValue = useDebounce(value, 1000);

  // Tip
  const [tip, setTip] = useState<string | null>(null);
  const [isTipVisible, setIsTipVisible] = useState(false);

  const clearTip = useCallback(() => {
    if (tip) {
      setTip(null);
      Transforms.removeNodes(editor, { 
        match: (draftNode: Node) => Element.isElement(draftNode) && (draftNode as DraftElement).type === 'tip',
        mode: 'highest'
      });
      setIsTipVisible(false);
    }
  }, [editor]);

  const showTip = useCallback((newTip: string) => {
    console.log("Showing tip:", newTip);
    if (newTip.length === 0 || newTip === tip) return;
    if (isTipVisible) {
      console.log("Clearing tip");
      clearTip();
    }
    console.log("Inserting tip");
    insertTip(editor, newTip);
    console.log("Tip inserted");
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
    
    getTip({ currentText }).then(showTip);
  }, [debouncedValue, editor, isTipVisible, tip, clearTip, showTip]);

  const onChange = useCallback((newValue: Descendant[]) => {
    setValue(newValue as DraftNode[]);
    console.log("Value changed", newValue);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Tab' && tip) {
      event.preventDefault();
      acceptTip();
    }
    clearTip();
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

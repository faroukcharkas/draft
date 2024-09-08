"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { createEditor, Descendant, Node, Transforms } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import Tip from "./tip";
import { motion } from "framer-motion";
import { Text } from 'slate'
import escapeHtml from 'escape-html'


function Element({ attributes, children, element }: { attributes: any, children: any, element: any }) {
  switch (element.type) {
    case 'tip':
      return (
            <Tip {...attributes}>{children}</Tip>
      )
    default:
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
  }
}

function insertTip(editor: any, text: string) {
  const tip = {
    type: 'tip',
    children: [{ text: text }],
  }
  Transforms.insertNodes(editor, tip)
}

function withTips(editor: any) {
  const { isInline, isVoid, markableVoid } = editor

  editor.isInline = (element: any) => {
    return element.type === 'tip' ? true : isInline(element)
  }

  editor.isVoid = (element: any) => {
    return element.type === 'mention' ? true : isVoid(element)
  }

  editor.markableVoid = (element: any) => {
    return element.type === 'mention' || markableVoid(element)
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

const serialize = (node: Node): string => {
  if (Text.isText(node)) {
    let string = escapeHtml(node.text)
    if (node.bold) {
      string = `<strong>${string}</strong>`
    }
    return string
  }

  const children = node.children.map(n => serialize(n)).join('')

  switch (node.type) {
    case 'quote':
      return `<blockquote><p>${children}</p></blockquote>`
    case 'paragraph':
      return `<p>${children}</p>`
    case 'link':
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    case 'tip':
      return ``
    default:
      return children
  }
}

export function DraftBody() {
  // Editor
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const editor: ReactEditor = useMemo(() => withTips(withReact(withHistory(createEditor()))), [])

  // Value
  const [value, setValue] = useState<string>('');
  const debouncedValue = useDebounce(value, 1000);

  // Tip
  const [tip, setTip] = useState<string | null>(null);
  const [isTipVisible, setIsTipVisible] = useState(false);

  const clearTip = useCallback(() => {
    setTip(null);
    Transforms.removeNodes(editor, { 
      match: (n: any) => n.type === 'tip',
      mode: 'highest'
    });
    setIsTipVisible(false);
  }, [editor]);

  useEffect(() => {
    if (isTipVisible) return;

    const currentText = debouncedValue;
    
    console.log("Getting tip for ", debouncedValue);
    getTip({ currentText }).then((generatedTip) => {
      if (generatedTip && generatedTip.length > 0 && generatedTip !== tip) {
        insertTip(editor, generatedTip);
        setTip(generatedTip);
      }
    });
  }, [debouncedValue, editor]);

  const onChange = useCallback((newValue: Descendant[]) => {
    let serializedValue = "";
    for (const node of newValue) {
      serializedValue += serialize(node);
    }
    console.log("serializedValue", serializedValue);
    setValue(serializedValue);
  }, []);

  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("onKeyDown", event);
    clearTip();
    if (event.key === 'Tab' && tip) {
      // Accept tip
      event.preventDefault();
      clearTip();
      editor.insertText(tip);
    }
  }, [editor, tip, clearTip]);

  return (
    <div className="flex flex-1 flex-col h-full">
      <Slate editor={editor} initialValue={[{ children: [{ text: value }] }]} onChange={onChange}>
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

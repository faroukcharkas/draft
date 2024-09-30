"use client";

import Title from "./title";
import Tools from "./tools/tools";
import "material-symbols/rounded.css";
import { EditorContent } from "@tiptap/react";
import { useEditor, Content } from "@tiptap/react";
import { useAutosave } from "@/hooks/use-autosave";
import { useSuggest } from "@/hooks/use-suggest";
import { EXTENSIONS } from "./extensions";
import { Tables } from "@/packages/schema";
import { useEffect } from "react";

function determineSaveStatus(isSaving: boolean, isSaved: boolean) {
  if (isSaving) {
      return "Saving";
  } else if (isSaved) {
      return "Changes saved";
  } else {
      return "Some changes not saved";
  }
}

export default function Editor({
  initialDocument,
}: {
  initialDocument: Tables<"document">;
}) {
  const { content, handleUpdate, isSaving, isSaved, onTitleChange, title } = useAutosave({
    initialContent: initialDocument.body,
    initialTitle: initialDocument.title,
    documentId: initialDocument.id,
  });

  const { handleKeyDown, handleSelectionChange, handleCreate, consumeDocumentId } =
    useSuggest();
  const editor = useEditor({
    extensions: EXTENSIONS,
    content: content as Content,
    onCreate: handleCreate,
    onUpdate: handleUpdate,
    onSelectionUpdate: handleSelectionChange,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "text-lg w-full h-full p-0 border-none outline-none bg-transparent",
      },
      handleKeyDown,
    },
  });

  useEffect(() => {
    consumeDocumentId(initialDocument.id);
  }, [consumeDocumentId, initialDocument.id]);
  
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col max-w-[750px] w-full h-full">
      <div className="flex flex-col gap-5 rounded-xl bg-background max-w-[850px] w-full h-full p-10 shadow-xl">
        <p className="text-sm text-muted-foreground italic">{determineSaveStatus(isSaving, isSaved)}</p>
        <Title onTitleChange={onTitleChange} title={title} />
        <Tools editor={editor}/>
        {/* editor frame */}
        <EditorContent editor={editor} />
        <div className="h-[200px]" />
      </div>
    </div>
  );
}

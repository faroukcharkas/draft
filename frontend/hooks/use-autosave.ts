import { useCallback, useState, useEffect } from "react";
import { updateDocumentBody, updateDocumentTitle } from "@/actions/documents/update";
import { Json } from "@/packages/schema";
import { useDebounce } from "@uidotdev/usehooks";
import { EditorEvents } from "@tiptap/core";

const AUTOSAVE_INTERVAL = 1000;

function plainContentify(content: Json): Json {
  return JSON.parse(JSON.stringify(content));
}

export interface UseAutosave {
  content: Json;
  setContent: (content: Json) => void;
  handleUpdate: (event: EditorEvents["update"]) => void;
  onTitleChange: (title: string) => void;
  isSaving: boolean;
  isSaved: boolean;
  title: string;
}

export function useAutosave({
  initialContent,
  initialTitle,
  documentId,
}: {
  initialContent: Json;
  initialTitle: string;
  documentId: string;
}): UseAutosave {
  const [title, setTitle] = useState<string>(initialTitle);
  const [content, setContent] = useState<Json>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const debouncedContent = useDebounce(content, AUTOSAVE_INTERVAL);

  useEffect(() => {
    if (debouncedContent !== initialContent) {
      setIsSaving(true);
      setIsSaved(false);
      updateDocumentBody(documentId, plainContentify(debouncedContent))
        .then(() => {
          setIsSaved(true);
        })
        .finally(() => {
          setIsSaving(false);
        });
    }
  }, [debouncedContent, documentId, initialContent]);

  const handleUpdate = useCallback(
    (event: EditorEvents["update"]) => {
      // TODO: Could be a preformance bottleneck
      const newContent = event.editor.getJSON();
      if (JSON.stringify(newContent) !== JSON.stringify(content)) {
        setContent(newContent);
        setIsSaved(false);
      }
    },
    [content]
  );

  const onTitleChange = useCallback(
    (title: string) => {
      setTitle(title);
      updateDocumentTitle(documentId, title);
    },
    [documentId]
  );

  return {
    content,
    setContent,
    handleUpdate,
    onTitleChange,
    title,
    isSaving,
    isSaved,
  };
}

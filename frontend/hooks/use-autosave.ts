import { useCallback, useState, useEffect } from "react";
import { saveDocumentBody } from "@/actions/documents/save";
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
  isSaving: boolean;
  isSaved: boolean;
}

export function useAutosave({
  initialContent,
  documentId,
}: {
  initialContent: Json;
  documentId: string;
}): UseAutosave {
  const [content, setContent] = useState<Json>(initialContent);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(true);
  const debouncedContent = useDebounce(content, AUTOSAVE_INTERVAL);

  useEffect(() => {
    if (debouncedContent !== initialContent) {
      setIsSaving(true);
      setIsSaved(false);
      saveDocumentBody(documentId, plainContentify(debouncedContent))
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

  return {
    content,
    setContent,
    handleUpdate,
    isSaving,
    isSaved,
  };
}

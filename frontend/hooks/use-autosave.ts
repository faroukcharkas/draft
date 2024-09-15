import { useCallback, useState, useEffect } from "react";
import { saveDocumentBody } from "@/actions/document/save";
import { Json } from "@/packages/schema";
import { useDebounce } from "@uidotdev/usehooks";
import { EditorEvents } from "@tiptap/core";
const AUTOSAVE_INTERVAL = 2500;

function plainContentify(content: Json): Json {
  return JSON.parse(JSON.stringify(content));
}

// This function doesn't work as expected -- messes up JSON structure
function filterOutPredictionElements(content: Json): Json {
  if (Array.isArray(content)) {
    return content.map(filterOutPredictionElements);
  } else if (typeof content === "object" && content !== null) {
    if (content.type === "prediction") {
      return null;
    }
    const filteredContent: Record<string, any> = {};
    for (const [key, value] of Object.entries(content)) {
      const filteredValue = filterOutPredictionElements(value ?? {});
      if (filteredValue !== null) {
        filteredContent[key] = filteredValue;
      }
    }
    return filteredContent;
  }
  return content;
}

export interface UseAutosave {
  content: Json;
  setContent: (content: Json) => void;
  handleUpdate: (event: EditorEvents["update"]) => void;
}

export function useAutosave({
  initialContent,
  documentId,
}: {
  initialContent: Json;
  documentId: string;
}): UseAutosave {
  const [content, setContent] = useState<Json>(initialContent);
  const debouncedContent = useDebounce(content, AUTOSAVE_INTERVAL);

  useEffect(() => {
    if (debouncedContent !== initialContent) {
      saveDocumentBody(documentId, plainContentify(debouncedContent));
    }
  }, [debouncedContent, documentId, initialContent]);

  const handleUpdate = useCallback(
    (event: EditorEvents["update"]) => {
      // TODO: Could be a preformance bottleneck
      const newContent = event.editor.getJSON();
      if (JSON.stringify(newContent) !== JSON.stringify(content)) {
        setContent(newContent);
      }
    },
    [content]
  );

  return {
    content,
    setContent,
    handleUpdate,
  };
}

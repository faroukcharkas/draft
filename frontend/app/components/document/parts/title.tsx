"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { saveDocumentTitle } from "../../../../actions/documents/save";

function NotEditing({
  value,
  handleToggleEdit,
}: {
  value: string;
  handleToggleEdit: () => void;
}) {
  return (
    <h1
      className="text-4xl font-bold"
      onMouseEnter={handleToggleEdit}
    >
      {value}
    </h1>
  );
}

function Editing({
  value,
  onChange,
  handleToggleEdit,
}: {
  value: string;
  onChange: (value: string) => void;
  handleToggleEdit: () => void;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          handleToggleEdit();
        }
      }}
      className="text-4xl font-bold bg-transparent border-none outline-none resize-none"
      onBlur={handleToggleEdit}
    />
  );
}

export function DocumentTitle({
  initialTitle,
  documentId,
}: {
  initialTitle: string;
  documentId: string;
}) {
  const [title, setTitle] = useState(initialTitle);
  const [isEditing, setIsEditing] = useState(false);
  const debouncedTitle = useDebounce(title, 5000);

  useEffect(() => {
    if (debouncedTitle !== initialTitle) {
      saveDocumentTitle(documentId, debouncedTitle);
    }
  }, [debouncedTitle, documentId, initialTitle]);

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <Editing
          value={title}
          onChange={setTitle}
          handleToggleEdit={handleBlur}
        />
      ) : (
        <NotEditing
          value={title}
          handleToggleEdit={handleToggleEdit}
        />
      )}
    </div>
  );
}

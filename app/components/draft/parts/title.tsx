"use client";

import { useState } from "react";

function NotEditing({ value, handleToggleEdit }: { value: string, handleToggleEdit: () => void }) {
  return <h1 className="text-4xl font-bold" onMouseEnter={handleToggleEdit}>{value}</h1>;
}

function Editing({ value, onChange, handleToggleEdit }: { value: string; onChange: (value: string) => void, handleToggleEdit: () => void }) {

  return <input 
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
  />;
}

export function DraftTitle() {
  const [title, setTitle] = useState("Untitled");
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <div>
      {isEditing ? (
        <Editing value={title} onChange={setTitle} handleToggleEdit={handleBlur} />
      ) : (
        <NotEditing value={title} handleToggleEdit={handleToggleEdit} />
      )}
    </div>
  );
}
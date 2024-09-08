"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";

function NotEditing({ value, handleToggleEdit }: { value: string, handleToggleEdit: () => void }) {
  return <p className="text-lg cursor-text h-full" onClick={handleToggleEdit} onMouseEnter={handleToggleEdit}>{value}</p>;
}

function Editing({ value, onChange, handleToggleEdit }: { value: string; onChange: (value: string) => void, handleToggleEdit: () => void }) {
  const [inputValue, setInputValue] = useState(value);
  const debouncedValue = useDebounce(inputValue, 5000);
  const [tip, setTip] = useState("");

  const getTip = async ({ currentText }: { currentText: string }) => {
    const response = await fetch("/api/tip", {
      method: "POST",
      body: JSON.stringify({ currentText }),
    });
    const data = await response.json();
    return data.tip;
  };

  useEffect(() => {
    getTip({ currentText: debouncedValue }).then((tip) => setTip(tip));
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  return <textarea 
    value={inputValue + " Tip: " + tip} 
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleToggleEdit();
      }
    }}
    
    className="text-lg w-full h-full p-0 border-none outline-none resize-none bg-transparent" 
    onBlur={handleToggleEdit}
  />;
}

export function BodyField() {
  const [body, setBody] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleToggleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleChange = (value: string) => {
    setBody(value);
  };

  return (
    <div className="flex flex-1 flex-col h-full">
      {isEditing ? (
        <Editing value={body} onChange={handleChange} handleToggleEdit={handleBlur} />
      ) : (
        <NotEditing value={body} handleToggleEdit={handleToggleEdit} />
      )}
    </div>
  );
}

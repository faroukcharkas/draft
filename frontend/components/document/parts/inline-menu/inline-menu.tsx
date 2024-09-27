import { BubbleMenu } from "@tiptap/react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function GenerateMenu() {
  const [input, setInput] = useState("");
  return (
    <div className="w-[350px] bg-popover p-2 rounded-md border border-border">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="w-full"
            placeholder="What should I write?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button onClick={() => {
            console.log(input);
          }}>Generate</Button>
        </div>
      </div>
    </div>
  );
}

function useGenerateMenu() {
  const [showGenerateMenu, setShowGenerateMenu] = useState(false);

  const toggleGenerateMenu = useCallback(() => {
    setShowGenerateMenu((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey && event.key === "g") {
        event.preventDefault();
        toggleGenerateMenu();
      }
    },
    [toggleGenerateMenu]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { showGenerateMenu };
}

export default function InlineMenu() {
  const { showGenerateMenu } = useGenerateMenu();

  return (
    <BubbleMenu
      updateDelay={0}
      editor={null}
      tippyOptions={{
        trigger: "manual",
      }}
    >
      {showGenerateMenu && <GenerateMenu />}
    </BubbleMenu>
  );
}

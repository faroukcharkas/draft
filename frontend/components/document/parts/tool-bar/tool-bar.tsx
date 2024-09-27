import { useCurrentEditor } from "@tiptap/react";
import { SingleIconToggle } from "./parts/single-icon-toggle";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Underline as UnderlineIcon,
  AlignCenter as AlignCenterIcon,
  AlignLeft as AlignLeftIcon,
  AlignRight as AlignRightIcon,
} from "iconoir-react/regular";
import { cx } from "class-variance-authority";

const toolBarStyle = cx([
  "flex flex-row items-center mb-4 min-h-[48px] rounded-2xl p-2 gap-2",
  "ml-[-4px] bg-white shadow-sm",
]);

export function ToolBar({ isSaving, isSaved }: { isSaving: boolean; isSaved: boolean }) {
  const { editor } = useCurrentEditor();
  const iconSize = 20;

  const toggles = [
    { action: "toggleBold", isActive: "bold", Icon: BoldIcon },
    { action: "toggleItalic", isActive: "italic", Icon: ItalicIcon },
    { action: "toggleUnderline", isActive: "underline", Icon: UnderlineIcon },
    { action: "setTextAlign", value: "left", isActive: ["textAlign", "left"], Icon: AlignLeftIcon },
    { action: "setTextAlign", value: "center", isActive: ["textAlign", "center"], Icon: AlignCenterIcon },
    { action: "setTextAlign", value: "right", isActive: ["textAlign", "right"], Icon: AlignRightIcon },
  ];

  return (
    <div className={toolBarStyle}>
      {toggles.map(({ action, value, isActive, Icon }) => (
        <SingleIconToggle
          key={action + (value || '')}
          onClick={() => {
            if (editor) {
              const chain = editor.chain();
              if (action in chain) {
                (chain[action as keyof typeof chain] as Function)(value).run();
              }
            }
          }}
          isToggled={Array.isArray(isActive) 
            ? editor?.isActive(isActive[0], isActive[1]) ?? false
            : editor?.isActive(isActive) ?? false
          }
          icon={<Icon width={iconSize} height={iconSize} />}
        />
      ))}
      <div className="ml-auto text-sm font-medium text-gray-600">
        {isSaving ? "Saving..." : isSaved ? "Saved" : ""}
      </div>
    </div>
  );
}

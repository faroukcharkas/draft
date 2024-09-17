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
  "flex flex-row mb-4 min-h-[48px] rounded-2xl p-1 gap-1",
  "bg-gradient-to-b from-[#f8f8f8] to-[#f5f5f5]",
  "border-t-[2px] border-[#fdfdfd]",
  "shadow-md",
]);

export function ToolBar() {
  const { editor } = useCurrentEditor();
  const iconSize = 24;
  return (
    <div className={toolBarStyle}>
      <SingleIconToggle
        onClick={() => {
          editor?.chain().toggleBold().run();
        }}
        isToggled={editor?.isActive("bold") ?? false}
        icon={
          <BoldIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
      <SingleIconToggle
        onClick={() => {
          editor?.chain().toggleItalic().run();
        }}
        isToggled={editor?.isActive("italic") ?? false}
        icon={
          <ItalicIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
      <SingleIconToggle
        onClick={() => {
          editor?.chain().toggleUnderline().run();
        }}
        isToggled={editor?.isActive("underline") ?? false}
        icon={
          <UnderlineIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
      <SingleIconToggle
        onClick={() => {
          editor?.chain().setTextAlign("left").run();
        }}
        isToggled={editor?.isActive("textAlign", "left") ?? false}
        icon={
          <AlignLeftIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
      <SingleIconToggle
        onClick={() => {
          editor?.chain().setTextAlign("center").run();
        }}
        isToggled={editor?.isActive("textAlign", "center") ?? false}
        icon={
          <AlignCenterIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
      <SingleIconToggle
        onClick={() => {
          editor?.chain().setTextAlign("right").run();
        }}
        isToggled={editor?.isActive("textAlign", "right") ?? false}
        icon={
          <AlignRightIcon
            width={iconSize}
            height={iconSize}
          />
        }
      />
    </div>
  );
}

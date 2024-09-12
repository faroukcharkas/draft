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

export function ToolBar() {
  const { editor } = useCurrentEditor();
  return (
    <div className="flex flex-row mb-4 bg-white rounded-2xl p-2 border border-gray-200">
      <SingleIconToggle
        onClick={() => {
          editor?.chain().toggleBold().run();
        }}
        isToggled={editor?.isActive("bold") ?? false}
        icon={
          <BoldIcon
            width={20}
            height={20}
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
            width={20}
            height={20}
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
            width={20}
            height={20}
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
            width={20}
            height={20}
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
            width={20}
            height={20}
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
            width={20}
            height={20}
          />
        }
      />
    </div>
  );
}

import { Toggle } from "./parts/toggle";
import { Divider } from "./parts/divider";
import React from "react";
import { Editor } from "@tiptap/react";

export default function Tools({ editor }: { editor: Editor }) {
    const toggles = [
        [
            { onClick: () => editor.chain().focus().toggleBold().run(), isActive: "bold", iconName: "format_bold" },
            { onClick: () => editor.chain().focus().toggleItalic().run(), isActive: "italic", iconName: "format_italic" },
            { onClick: () => editor.chain().focus().toggleUnderline().run(), isActive: "underline", iconName: "format_underlined" },
        ],
        [
            { onClick: () => editor.chain().focus().setTextAlign("left").run(), isActive: ["textAlign", "left"], iconName: "format_align_left" },
            { onClick: () => editor.chain().focus().setTextAlign("center").run(), isActive: ["textAlign", "center"], iconName: "format_align_center" },
            { onClick: () => editor.chain().focus().setTextAlign("right").run(), isActive: ["textAlign", "right"], iconName: "format_align_right" },
        ],
        [
            { onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: "bulletList", iconName: "format_list_bulleted" },
            { onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: "orderedList", iconName: "format_list_numbered" },
        ],
    ];

    return (
        <div className="flex flex-row gap-3 z-10 rounded-lg -ml-1 items-center justify-between">
            <div className="flex flex-row gap-3 items-center">
                {toggles.map((group, groupIndex) => (
                    <React.Fragment key={groupIndex}>
                        <div className="flex flex-row gap-3 items-center">
                            {group.map((toggle) => (
                                <Toggle
                                    key={toggle.iconName}
                                    iconName={toggle.iconName}
                                    onClick={toggle.onClick}
                                    isToggled={
                                        Array.isArray(toggle.isActive)
                                            ? editor.isActive({ textAlign: toggle.isActive[1] })
                                            : editor.isActive(toggle.isActive)
                                    }
                                />
                            ))}
                        </div>
                        {groupIndex < toggles.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
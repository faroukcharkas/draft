import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { motion } from "framer-motion";
import React from "react";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

const TipComponent = ({ node }: { node: ProseMirrorNode }) => {
  console.log(node.attrs);
  return (
    <NodeViewWrapper
      as="span"
      className="inline"
    >
      <motion.span
        contentEditable={false}
        className="opacity-50 inline"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 500,
          damping: 25,
        }}
      >
        {node.attrs.tip}
      </motion.span>
    </NodeViewWrapper>
  );
};

export const Tip = Node.create({
  name: "tip",

  group: "inline",

  inline: true,

  selectable: false,

  addAttributes() {
    return {
      tip: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-tip]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ["span", mergeAttributes(HTMLAttributes, { "data-tip": "" }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TipComponent);
  },
});

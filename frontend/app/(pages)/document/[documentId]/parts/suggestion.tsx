import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { motion } from "framer-motion";
import React from "react";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

const SuggestionComponent = ({ node }: { node: ProseMirrorNode }) => {
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
        {node.attrs.suggestion}
      </motion.span>
    </NodeViewWrapper>
  );
};

export const Suggestion = Node.create({
  name: "suggestion",

  group: "inline",

  inline: true,

  selectable: false,

  addAttributes() {
    return {
      suggestion: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-suggestion]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-suggestion": "" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SuggestionComponent);
  },
});

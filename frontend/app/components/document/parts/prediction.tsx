import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { motion } from "framer-motion";
import React from "react";
import { Node as ProseMirrorNode } from "@tiptap/pm/model";

const PredictionComponent = ({ node }: { node: ProseMirrorNode }) => {
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
        {node.attrs.prediction}
      </motion.span>
    </NodeViewWrapper>
  );
};

export const Prediction = Node.create({
  name: "prediction",

  group: "inline",

  inline: true,

  selectable: false,

  addAttributes() {
    return {
      prediction: {
        default: "",
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-prediction]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, { "data-prediction": "" }),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(PredictionComponent);
  },
});

import { motion } from "framer-motion";
import { RenderElementProps } from 'slate-react';
import { Fragment } from "react";
import { TipElement } from "@/packages/document/src/types";

type TipProps = RenderElementProps & {
  element: TipElement
}

export default function Tip({ children, attributes, element }: TipProps) {
  return (
    <motion.span
      contentEditable={false}
      className="opacity-50 inline"
      {...attributes}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 25 }}
    >
      <Fragment>
        {element.tip}
        {children}
      </Fragment>
    </motion.span>
  );
}
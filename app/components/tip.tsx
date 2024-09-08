import { motion } from "framer-motion";

export default function Tip({ children, attributes }: { children: any, attributes: any }) {
  return (
    <motion.span
      contentEditable={false}
      className="opacity-50 inline"
      {...attributes}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 0.5, y: 0 }}
      transition={{ duration: 0.2, type: "spring", stiffness: 500, damping: 25 }}
    >
      {children}
    </motion.span>
  );
}
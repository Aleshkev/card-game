import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

export type Props = {
  onClick: () => void;
  label?: string;
  autoClickTimeout?: number;
};

export function ClickScreen({ onClick, label, autoClickTimeout }: Props) {
  if (autoClickTimeout !== undefined) {
    useEffect(() => {
      const timer = setTimeout(onClick, autoClickTimeout * 1000);
      return () => clearTimeout(timer);
    }, []);
  }

  return (
    <motion.div
      className="absolute w-full h-full top-0 flex flex-col gap-2 p-2"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 5 }}
      key={"hello" + label}
    >
      {label || "Click to continue"}
    </motion.div>
  );
}

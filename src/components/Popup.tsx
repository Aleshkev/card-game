import { AnimatePresence, motion } from "motion/react";
import React, { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  onDismiss: () => void;
}>;

export function Popup({ onDismiss, children }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute w-full h-full top-0 backdrop-blur-sm p-4 flex items-center"
        onClick={onDismiss}
        animate={{ "--tw-backdrop-blur": "blur(4px)" }}
      >
        <div className=" mx-auto border border-black bg-white/50 p-4 flex flex-col items-center gap-1">
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

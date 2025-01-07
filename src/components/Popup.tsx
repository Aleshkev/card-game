import { AnimatePresence, motion } from "motion/react";
import React, { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{
  onDismiss: () => void;
}>;

export function Popup({ onDismiss, children }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute w-full h-full top-0 backdrop-blur p-4 flex items-center"
        onClick={onDismiss}
        animate={{
          "--tw-backdrop-blur": "blur(8px)",
          opacity: 1,
        }}
        exit={{
          // "--tw-backdrop-blur": "blur(0px)",
          opacity: 0,
        }}
      >
        <div
          className=" mx-auto  p-4 flex flex-col items-center gap-1"
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // transition={{ duration: .5 }}
        >
          {children}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

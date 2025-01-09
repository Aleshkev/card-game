import { motion } from "motion/react";

export type Props = {
  isBlocked?: boolean;
  layoutId?: string
};

export function CardPlaceholder({ isBlocked, layoutId }: Props) {
  return (
    <motion.div
      className="w-[160px] h-[220px] flex p-8"
      layout={layoutId ? "position" : undefined}
      layoutId={layoutId}
      initial={{ scale: 0.5, opacity: 0.5 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div className="grow border-4 border-slate-400  border-dashed rounded-lg">
        {isBlocked && "❌"}
      </div>
    </motion.div>
  );
}

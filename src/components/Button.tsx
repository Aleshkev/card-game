import { motion } from "motion/react";

export type Props = {
  text: string;
  onClick: () => void;
  className?: string
};

export function Button({ text, onClick, className }: Props) {
  return (
    <motion.div
      onTap={onClick}
      className={"rounded-lg px-5 py-2 uppercase  font-bold text-xl bg-blue-600 text-white cursor-pointer" + (className || "")}
      whileHover={{scale: 1.1}}
    >
      {text}
    </motion.div>
  );
}

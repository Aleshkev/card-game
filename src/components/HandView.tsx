import { motion } from "motion/react";
import { Hand, handToString } from "../types/hand";

export type Props = {
  hand: Hand;
};

// TODO: Rename this
export function HandView({ hand }: Props) {
  return (
    <motion.div
      className=" text-2xl uppercase font-bold tracking-[.05em] bg-black/40 backdrop-blur text-white  p-4 px-8 rounded-lg drop-shadow"
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      exit={{ scaleX: 0.5, opacity: 0 }}
    >
      {handToString(hand)}
    </motion.div>
  );
}

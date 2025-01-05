import { motion } from "motion/react";
import { Card } from "../types/card";
export type Props = {
  card: Card;
  onClick?: () => void;
  highlighted?: boolean;
  isBackside?: boolean;
};

export function CardView({ card, onClick, highlighted, isBackside }: Props) {
  const text = "" + card.rank;
  const color = card.suit <= 2 ? "#dc2626" : "#262626";
  const suit = "_♥♦♠♣"[card.suit];

  return (
    <motion.div
      key={card.id}
      layout="position"
      layoutId={"layoutId_card_" + card.id}
      // Because rotateY apparently doesn't work (why?), we rotate 180 degrees to have any animation at all
      // TODO: At least change opacity smoothly?
      style={{ rotate: isBackside ? 180 : 0, rotateY: isBackside ? 180 : 0 }}
      className="[transform-style:preserve-3d]"
      onClick={() => onClick && onClick()}
      whileHover={onClick && { translateY: -8 }}
      transition={{ layout: {duration: 0.05}, duration: 0.1}}
    >
      <motion.div
        key={card.id}
        // style={{ color, transform: isBackside ? "rotateY(180deg)" : "rotateY(0)" }}
        style={{ color }}
        className={`w-20 h-28 border border-black ${onClick ? " cursor-pointer" : ""}  flex  select-none ${highlighted ? "-translate-y-2 shadow" : ""} [transform-style:preserve-3d]`}
      >
        <div className="w-full h-full [transform-style:preserve-3d]">
          <div className="absolute top-0 left-0 w-full h-full   bg-white [backface-visibility:hidden]">
            <div className="absolute left-0 top-0 px-2 py-1 flex flex-col items-center leading-none">
              <p>{text}</p>
              <p>{suit}</p>
            </div>
            <div className="absolute right-0 bottom-0 px-2 py-1 rotate-180 flex flex-col items-center leading-none">
              <p>{text}</p>
              <p>{suit}</p>
            </div>
          </div>
          <div
            className="absolut top-0 left-0 w-full h-full bg-slate-100 [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          ></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

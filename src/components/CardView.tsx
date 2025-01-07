import { motion } from "motion/react";
import { Card } from "../types/card";
import { CardFrontSideGraphic } from "./CardFrontSideGraphic";
import { CardBackSideGraphic } from "./CardBackSideGraphic";
export type Props = {
  card: Card;
  onClick?: () => void;
  highlighted?: boolean;
  isBackside?: boolean;
  rotate?: number;
};

export function CardView({
  card,
  onClick,
  highlighted,
  isBackside,
  rotate,
}: Props) {
  rotate = rotate || 0;

  // TODO: when a card leaves player's hand, it is behind all other cards in player's hand. should be above cards to the left still
  return (
    <motion.div
      key={card.id}
      layout="position"
      layoutId={"layoutId_card_" + card.id}
      // Because rotateY apparently doesn't work (why?), we rotate 180 degrees to have any animation at all
      // TODO: At least change opacity smoothly?
      style={{
        rotate: isBackside ? 360 + rotate : rotate,
        scale: highlighted ? 1.1 : 1,
        // rotateY: isBackside ? 180 : 0,
      }}
      onHoverStart={() => {
        document.getElementsByTagName("body")[0].style.paddingRight = "0px";
      }}
      className="cursor-pointer drop-shadow-lg "
      onTap={() => onClick && onClick()}
      whileHover={onClick && { translateY: -20, translateX: -20, scale: 1.05 }}
      transition={{ layout: { duration: 0.2 }, duration: 0.3 }}
    >
      <div
        className="w-full h-full [transform-style:preserve-3d] relative"
        style={{ transform: isBackside ? "rotateY(180deg)" : "" }}
      >
        <div className="w-full h-full [backface-visibility:hidden]">
          <CardFrontSideGraphic card={card} />
        </div>
        <div
          className="absolute top-0 left-0 [backface-visibility:hidden] "
          style={{ transform: "rotateY(180deg)" }}
        >
          <CardBackSideGraphic />
        </div>
      </div>
    </motion.div>
  );
}

import { CSSProperties } from "react";
import { Card, CardId } from "../types/card";
import { enumFromTo } from "../utilities/functional";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

export type Props = {
  cards: Card[];
  placeholders?: number;
  onClickCard?: (card: Card) => void;
  highlighted?: CardId[];
  isFan?: boolean;
  layoutId: string
};

export function CardArrayView({
  cards,
  onClickCard,
  placeholders,
  highlighted,
  isFan,
  layoutId
}: Props) {
  if (placeholders === undefined) {
    placeholders = 1;
  }

  const n = cards.length;

  return (
    <LayoutGroup>
      <div className="">
        <div className="grid">
          <div className="row-start-1 col-start-1">
            <div className="flex flex-row gap-2">
              <AnimatePresence>
                {enumFromTo(1, placeholders).map((i) => (
                  <motion.div exit={{scale: 0, opacity: 0}} key={i}>
                    <CardPlaceholder key={i} layoutId={`${layoutId}_placeholder_${i}`} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="row-start-1 col-start-1">
            <div className={`flex flex-row gap-2 ${isFan ? "ml-[100px]" : ""}`}>
              {cards.map((card, i) => (
                <div key={card.id} className={`${isFan ? "-ml-[100px]" : ""}`}>
                  <CardView
                    card={card}
                    onClick={onClickCard && (() => onClickCard(card))}
                    highlighted={highlighted?.includes(card.id)}
                    rotate={isFan ? 3 * (i - (n - 1) / 2) : undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutGroup>
  );
}

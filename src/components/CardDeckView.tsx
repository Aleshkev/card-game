import { motion } from "motion/react";
import { CardPlaceholder } from "./CardPlaceholder";
import { Card } from "../types/card";
import { CardView } from "./CardView";
import { useState } from "react";

export type Props = {
  cards: Card[];
  onClick?: () => void;
};

export function CardDeckView({ cards, onClick }: Props) {
  return (
    <div className="grid">
      <div className=" row-start-1 col-start-1">
        <CardPlaceholder />
      </div>
      <div className=" row-start-1 col-start-1">
        <motion.div
          className={`${onClick ? "cursor-pointer" : ""}`}
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative">
            <div className="w-[150px] h-[220px]">
              <div className="relative">
                {cards.map((card, i) => (
                  <motion.div
                    key={card.id}
                    style={{ translateX:  2 * i }}
                    className="absolute"
                  >
                    <CardView card={card} isBackside={true} />
                  </motion.div>
                ))}
              </div>
            </div>
            <div className=" absolute right-0 bottom-0 translate-y-8 font-bold text-xl text-blue-600">
              {cards.length}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

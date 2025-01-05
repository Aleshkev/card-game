import { motion } from "motion/react";
import { CardPlaceholder } from "./CardPlaceholder";
import { Card } from "../types/card";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
  onClick?: () => void;
};

export function CardStack({ cards, onClick }: Props) {
  console.log(cards);
  return (
    <div className="grid">
      <div className=" row-start-1 col-start-1">
        <CardPlaceholder />
      </div>
      <div className=" row-start-1 col-start-1">
        <div className={`${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
          <div className=" flex flex-row items-end gap-2">
            <div className="w-20 h-28">
              <div className="relative">
                {cards.map((card, i) => (
                  // <motion.div
                  //   layoutId={"layoutId_card_" + card.id}
                  //   key={card.id}
                  //   style={{ left: `-${2 * i}px` }}
                  //   className="absolute w-20 h-28 border  border-black bg-slate-100"
                  // ></motion.div>
                  <div key={card.id} style={{ left: `-${2 * i}px` }} className="absolute">
                    <CardView key={card.id} card={card} isBackside={true}/>
                  </div>
                ))}
              </div>
            </div>
            <p className="">{cards.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

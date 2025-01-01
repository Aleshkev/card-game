import { Card, sortCards } from "../types/types";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
};

export function CardGridView({ cards }: Props) {
  const cardsSorted = sortCards(cards);
  return (
    <div
      className="bg-white/50 border border-black p-4  backdrop-blur-sm m-4 mx-auto flex flex-col gap-2"
    >
      <div className="flex flex-row flex-wrap gap-2 ">
        {cardsSorted.map((card) => (
          <CardView key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

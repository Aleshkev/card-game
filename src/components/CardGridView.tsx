import { Card, sortCards } from "../types/types";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
};

export function CardGridView({ cards }: Props) {
  const cardsSorted = sortCards(cards);
  return (
    <div className=" mx-auto flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-2 ">
        {(cardsSorted.length &&
          cardsSorted.map((card) => (
            <CardView key={card.id} card={card} />
          ))) || <CardPlaceholder />}
      </div>
    </div>
  );
}

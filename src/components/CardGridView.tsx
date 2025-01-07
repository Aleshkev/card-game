import { Card, sortCards } from "../types/card";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
};

export function CardGridView({ cards }: Props) {
  const cardsSorted = sortCards(cards);
  return (
    <div className=" mx-auto flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-2 ml-[100px] ">
        {(cardsSorted.length &&
          cardsSorted.map((card) => (
            <div className="-ml-[100px]" key={card.id}>
              <CardView card={card} />
            </div>
          ))) || <CardPlaceholder />}
      </div>
    </div>
  );
}

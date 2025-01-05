import { Card, CardId } from "../types/card";
import { enumFromTo } from "../utilities/functional";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
  placeholders?: number;
  onClickCard?: (card: Card) => void;
  highlighted?: CardId[];
};

export function CardArrayView({
  cards,
  onClickCard,
  placeholders,
  highlighted,
}: Props) {
  if (placeholders === undefined) {
    placeholders = 1;
  }

  return (
    <div className="">
      <div className="grid">
        <div className="row-start-1 col-start-1">
          <div className="flex flex-row gap-2">
            {enumFromTo(1, placeholders).map((i) => (
              <CardPlaceholder key={i} />
            ))}
          </div>
        </div>
        <div className="row-start-1 col-start-1">
          <div className="flex flex-row gap-2">
            {cards.map((card) => (
              <CardView
                card={card}
                key={card.id}
                onClick={() => onClickCard && onClickCard(card)}
                highlighted={highlighted?.includes(card.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

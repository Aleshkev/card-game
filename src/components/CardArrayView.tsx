import { Card } from "../types/types";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
  placeholders?: number;
  onClickCard?: (card: Card) => void;
};

export function CardArrayView({ cards, onClickCard, placeholders }: Props) {
  if (placeholders === undefined) {
    placeholders = 1;
  }

  return (
    <div className="flex flex-row  justify-center gap-2">
      {cards.map((card) => (
        <CardView
          card={card}
          key={card.id}
          onClick={() => onClickCard && onClickCard(card)}
        />
      ))}
      {Array.from(
        { length: Math.max(0, placeholders - cards.length) },
        (_, i) => (
          <CardPlaceholder key={i} />
        )
      )}
    </div>
  );
}

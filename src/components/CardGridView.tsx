import { Card, sortCards } from "../types/types";
import { CardView } from "./CardView";

export type Props = {
  cards: Card[];
  onDismiss: () => void;
};

export function CardGridView({ cards, onDismiss }: Props) {
  const cardsSorted = sortCards(cards);
  return (
    <div
      className="bg-white/50 border border-black p-4  backdrop-blur-sm m-4 max-w-[30em] mx-auto flex flex-col gap-2"
      onClick={onDismiss}
    >
      <p>Cards:</p>
      <div className="flex flex-row flex-wrap gap-2 ">
        {cardsSorted.map((card) => (
          <CardView key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

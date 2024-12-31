import { Card } from "../types/types";

export type Props = {
  card: Card;
  onClick?: () => void;
};

export function cardToText(card: Card): string {
  return card.kind === "Joker"
    ? "*"
    : card.kind === "Regular"
      ? "" + card.value
      : card;
}

export function cardToColor(card: Card): string {
  return card.kind === "Joker"
    ? "#525252"
    : card.kind === "Regular"
      ? ["", "#dc2626", "#65a30d", "#2563eb", "#eab308"][card.color]
      : card;
}

export function cardToSuit(card: Card): string {
  return card.kind === "Joker"
    ? ""
    : card.kind === "Regular"
      ? "_♠♥♦♣"[card.color]
      : card;
}

export function CardView({ card, onClick }: Props) {
  return (
    <div
      key={card.id}
      style={{ color: `${cardToColor(card)}` }}
      className={`w-20 h-28 border border-black ${onClick ? "hover:-translate-y-2 cursor-pointer" : ""}  flex px-2 bg-white select-none`}
      onClick={() => onClick && onClick()}
    >
      <div className="relative w-full h-full">
        <p className="absolute left-0 top-0">
          {cardToText(card)}&nbsp;
          {cardToSuit(card)}
        </p>
        <p className="absolute right-0 bottom-0 rotate-180">
          {cardToText(card)}&nbsp;
          {cardToSuit(card)}
        </p>
      </div>
    </div>
  );
}

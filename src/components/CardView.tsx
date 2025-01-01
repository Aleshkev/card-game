import { Card } from "../types/types";

export type Props = {
  card: Card;
  onClick?: () => void;
};

export function CardView({ card, onClick }: Props) {
  const text = "" + card.value;
  const color = ["", "#dc2626", "#65a30d", "#2563eb", "#eab308"][card.color];
  const suit = "_♠♥♦♣"[card.color];

  return (
    <div
      key={card.id}
      style={{ color }}
      className={`w-20 h-28 border border-black ${onClick ? "hover:-translate-y-2 cursor-pointer" : ""}  flex px-2 bg-white select-none`}
      onClick={() => onClick && onClick()}
    >
      <div className="relative w-full h-full">
        <p className="absolute left-0 top-0">
          {text}&nbsp;
          {suit}
        </p>
        <p className="absolute right-0 bottom-0 rotate-180">
          {text}&nbsp;
          {suit}
        </p>
      </div>
    </div>
  );
}

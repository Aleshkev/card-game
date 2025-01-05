import { Card } from "../types/card";
export type Props = {
  card: Card;
  onClick?: () => void;
  highlighted?: boolean;
};

export function CardView({ card, onClick, highlighted }: Props) {
  const text = "" + card.rank;
  const color = card.suit <= 2 ? "#dc2626" : "#262626";
  const suit = "_♥♦♠♣"[card.suit];

  return (
    <div
      key={card.id}
      style={{ color }}
      className={`w-20 h-28 border border-black ${onClick ? "hover:-translate-y-2 cursor-pointer" : ""}  flex px-2 py-1 bg-white select-none ${highlighted ? "-translate-y-2 shadow" : ""}`}
      onClick={() => onClick && onClick()}
    >
      <div className="relative w-full h-full">
        <div className="absolute left-0 top-0 flex flex-col items-center leading-none">
          <p>{text}</p>
          <p>{suit}</p>
        </div>
        <div className="absolute right-0 bottom-0 rotate-180 flex flex-col items-center leading-none">
          <p>{text}</p>
          <p>{suit}</p>
        </div>
      </div>
    </div>
  );
}

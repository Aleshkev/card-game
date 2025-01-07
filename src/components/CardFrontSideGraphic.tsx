import { Card } from "../types/card";

export type Props = {
  card: Card;
};

export function CardFrontSideGraphic({ card }: Props) {
  const text = "" + card.rank
  // const text =  card.rank === 10 ? "10" : "_A23456789_JQK"[card.rank];
  // const color = card.suit <= 2 ? "#dc2626" : "#262626";
  const color = ["", "#ef4444", "#facc15", "#65a30d", "#111827"][card.suit];
  const suit = "_♥♦♠♣"[card.suit];

  const part = (
    <>
      <div className="absolute left-4 top-4">
        <p className="ml-[-50%] mt-[-12px] font-bold text-2xl tracking-[-0.1em]">
          {text}
        </p>
      </div>
      <div className="absolute left-4 top-10">
        <p className="ml-[-50%] mt-[-12px] font-bold text-2xl">{suit}</p>
      </div>
    </>
  );

  return (
    <div
      className="w-[160px] h-[220px]  bg-yellow-50 p-2 font-sans rounded-lg select-none"
    >
      <div
        className="w-full h-full rounded text-yellow-50 relative"
        style={{ backgroundColor: color }}
      >
        {part}
        <div className="w-full h-full rotate-180">{part}</div>
      </div>
    </div>
  );
}



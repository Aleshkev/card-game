import { CardPlaceholder } from "./CardPlaceholder";

export type Props = {
  nCards: number;
  onClick?: () => void;
};

export function CardStack({ nCards, onClick }: Props) {
  return (
    <div className={`${onClick ? "cursor-pointer" : ""}`} onClick={onClick}>
      {nCards === 0 ? (
        <CardPlaceholder />
      ) : (
        <div className=" flex flex-row items-end gap-2">
          <div className="w-20 h-28">
            <div className="relative">
              {Array.from({ length: Math.min(nCards, 4) }, (_, i) => (
                <div
                  key={i}
                  style={{ left: `-${2 * i}px` }}
                  className="absolute w-20 h-28 border  border-black bg-slate-100"
                ></div>
              ))}
            </div>
          </div>
          <p className="">{nCards}</p>
        </div>
      )}
    </div>
  );
}

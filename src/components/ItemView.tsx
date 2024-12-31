import { Item } from "../types/types";

export type Props = {
  item: Item;
  onClick?: () => void;
};

function getDescription(item: Item): string {
  switch (item.kind) {
    case "MagnifyingGlass":
      return "See dealer's next hand";
    case "Beer":
      return "Discard selected cards from your hand";
  }
}

function getText(item: Item): string {
  switch (item.kind) {
    case "MagnifyingGlass":
      return "🔎";
    case "Beer":
      return "🚬";
  }
}

export function ItemView({ item, onClick }: Props) {
  return (
    <div
      key={item.id}
      title={getDescription(item)}
      className="w-20 h-28 border border-black  hover:-translate-y-2 flex flex-col px-2 bg-orange-50 items-center justify-center"
      onClick={() => onClick && onClick()}
    >
      <p>{getText(item)}</p>
    </div>
  );
}

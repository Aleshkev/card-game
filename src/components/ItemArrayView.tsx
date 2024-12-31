import { Card, Item } from "../types/types";
import { CardPlaceholder } from "./CardPlaceholder";
import { CardView } from "./CardView";
import { ItemView } from "./ItemView";

export type Props = {
  items: Item[];
  onClickItem?: (item: Item) => void;
};

export function ItemArrayView({ items, onClickItem }: Props) {
  return (
    <div className="flex flex-row gap-2">
      {items.map((item) => (
        <ItemView
          item={item}
          key={item.id}
          onClick={() => onClickItem && onClickItem(item)}
        />
      ))}
    </div>
  );
}

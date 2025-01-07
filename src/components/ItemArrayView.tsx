import { Item } from "../types/item";
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
        <div key={item.id} className="-ml-[20px]">
          <ItemView
            item={item}
            onClick={() => onClickItem && onClickItem(item)}
          />
        </div>
      ))}
    </div>
  );
}

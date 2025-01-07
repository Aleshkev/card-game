import { Item } from "../types/item";

export type Props = {
  item: Item;
};

function itemInfo(item: Item): [string, string, string] {
  switch (item.kind) {
    case "MagnifyingGlass":
      return ["Magnif. Glass", "🔎", "Show the dealer's next play."];
    case "TrashCan":
      return ["Trash can", "🗑️", "Discard dealer's next play."];
    case "Apple":
      return ["Apple", "🍎", "Restore one life."]
  }
}

export function ItemFrontSideGraphic({ item }: Props) {
  const [label, icon, description] = itemInfo(item);

  return (
    <div className="w-[160px] h-[220px]   bg-indigo-500 text-white p-2 font-sans rounded select-none flex flex-col gap-2">
      <div className="uppercase font-bold text-sm rounded bg-indigo-800 px-2 py-1">
        {label}
      </div>
      <div className="w-full h-[70px] flex items-center  justify-center">
        <p className=" text-6xl [text-shadow:-2px_-2px_0_#3730a3,_2px_-2px_0_#3730a3,_-2px_2px_0_#3730a3,_2px_2px_0_#3730a3]">
          {icon}
        </p>
      </div>
      <div className="w-full grow bg-indigo-800 rounded px-2 py-1 relative">
        {description}
        {/* <div className="absolute bottom-0 left-[0px] bg-indigo-500 rounded-tr">{icon}</div> */}
      </div>
    </div>
  );
}

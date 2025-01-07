import { newId, shuffle } from "../utilities/functional"

export type ItemId = number & { _: "ItemId" }
export const newItemId = () => newId() as ItemId

export const itemKinds = ["MagnifyingGlass", "TrashCan", "Apple"] as const
export type Item = {
  kind: typeof itemKinds[number]
  id: ItemId
} & { _: "Item" }



export function randomItems(n: number): Item[] {
  let items: Item[] = []
  for (let i = 0; i < n; ++i) {
    const kind = shuffle(itemKinds)[0]
    items.push({ kind, id: newItemId() } as Item);
  }
  return items
}

import { newId } from "../utilities/functional"

export type ItemId = number & { _: "ItemId" }
export const newItemId = () => newId() as ItemId
export type Item = {
  kind: "MagnifyingGlass" | "Beer"
  id: ItemId
}



export function randomItems(n: number): Item[] {
  let items: Item[] = []
  for (let i = 0; i < n; ++i) {
    const r = Math.random()
    items.push(r < .5 ? { kind: "MagnifyingGlass", id: newItemId() } : { kind: "Beer", id: newItemId() });
  }
  return items
}

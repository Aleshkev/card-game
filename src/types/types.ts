import { count, enumFromTo } from "../utilities/functional"

let nextId = 1
const newId = () => nextId++


export type CardId = number & { _: "CardId" }
export const newCardId = () => newId() as CardId

export type Card = {
  id: CardId
  value: number
  color: number
} & { _: "Card" }
export const minCardValue = 1
export const maxCardValue = 13
export const minCardColor = 1
export const maxCardColor = 4
export const newCard: ((x: { value: number, color: number }) => Card) =
  ({ value, color }) => {
    console.assert(minCardValue <= value && value <= maxCardValue)
    console.assert(minCardColor <= color && color <= maxCardColor)
    return { id: newCardId(), value, color } as Card
  }

export function sortCards(cards: Card[]): Card[] {
  const r = cards.slice()
  r.sort((a, b) => {
    return a.value - b.value || a.color - b.color
  })
  return r
}

// export type GameStatus = "Show"


export type GameState = {
  playerLives: number
  round: RoundState
  roundMeta: RoundMeta
  showDeck: "dealer" | "player" | "none"
}

export type RoundMeta = {
  cardsPerHand: number
  idealCards: number
  hands: number
  items: number
}

export type ItemId = number & { _: "ItemId" }
let nextItemId = 0
export function newItemId() {
  return (nextItemId++) as ItemId
}
export type Item = {
  kind: "MagnifyingGlass" | "Beer"
  id: ItemId
}

export type RoundState = {
  playerCards: Card[]  // Includes played hands (but they are not displayed)
  playerHand: Card[]
  playerDeck: Card[]
  playerItems: Item[]
  dealerHand: Card[]
  dealerDeck: Card[]
}


export function standardDeck(): Card[] {
  let cards: Card[] = []
  for (let color = 1; color <= 4; ++color) {
    for (let value = 1; value <= 13; ++value) {
      cards.push(newCard({ color, value }))
    }
  }
  return cards
}

export function randomItems(n: number): Item[] {
  let items: Item[] = []
  for (let i = 0; i < n; ++i) {
    const r = Math.random()
    items.push(r < .5 ? { kind: "MagnifyingGlass", id: newItemId() } : { kind: "Beer", id: newItemId() });
  }
  return items
}


// export function getScore(hand: Card[]) {
//   return hand.reduce((a, b) => a * (b.kind === "Joker" ? 20 : b.value), 1);
// }

// export function getWinner(left: Card[], right: Card[]): "Left" | "Right" | "Draw" {
//   // TODO: Poker hands
//   let leftScore = getScore(left), rightScore = getScore(right)
//   return leftScore === rightScore ? "Draw" : leftScore < rightScore ? "Left" : "Right"
// }


export function getScore(cards: Card[]): number {

  const recognised: string[] = []
  const scores = []

  for (let start = minCardValue; start <= maxCardValue; ++start) {
    for (let stop = start; stop <= maxCardValue; ++stop) {
      if (!cards.some(({ value }) => value === stop)) break;
      const length = stop - start + 1
      recognised.push(length > 1 ? `${length}-flush (${stop} high card)` : `${stop} high card`)
      scores.push((stop - start + 1) * 1000 + 100 + stop)
    }
  }

  for (let val = minCardValue; val <= maxCardValue; ++val) {
    let nColors = 0;
    for (let col = minCardColor; col <= maxCardColor; ++col) {
      if (cards.some(({ value, color }) => value === val && col === color)) {
        ++nColors;
      }
    }
    if (nColors < 2) continue;
    recognised.push(`${nColors} of a kind (${val} high card)`)
    scores.push(nColors * 1000 + 200 + val)
  }

  console.log(cards, recognised)
  return Math.max(...scores)
}


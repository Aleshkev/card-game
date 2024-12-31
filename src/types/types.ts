import { count, enumFromTo } from "../utilities/functional"


export type CardColor = number & { _: "CardColor" }
export const minCardColor = 1
export const maxCardColor = 4
export function toCardColor(x: number): CardColor {
  console.assert(1 <= x && x <= 4)
  return x as CardColor
}

export type CardValue = number & { _: "CardValue" }
export const minCardValue = 1
export const maxCardValue = 13
export function toCardValue(x: number): CardValue {
  console.assert(minCardValue <= x && x <= maxCardValue)
  return x as CardValue
}

export type CardId = number & { _: "CardId" }
let nextCardId = 0
export function newCardId(): CardId {
  return (nextCardId++) as CardId
}

export type JokerCard = {
  kind: "Joker"
  id: CardId
}
export type RegularCard = {
  kind: "Regular"
  id: CardId
  color: CardColor
  value: CardValue
}
export type Card = JokerCard | RegularCard

export function sortCards(cards: Card[]): Card[] {
  const r = cards.slice()
  r.sort((a, b) => {
    let [aValue, aColor] = a.kind === "Joker" ? [-1, -1] : [a.value, a.color]
    let [bValue, bColor] = b.kind === "Joker" ? [-1, -1] : [b.value, b.color]
    return aColor - bColor || aValue - bValue
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
  for (let i = 0; i < 4; ++i) {
    cards.push({ kind: "Joker", id: newCardId() })
  }
  for (let color = 1; color <= 4; ++color) {
    for (let value = 1; value <= 13; ++value) {
      cards.push({ kind: "Regular", id: newCardId(), color: toCardColor(color), value: toCardValue(value) })
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


export function getScore(hand: Card[]): number {

  const recognised: string[] = []
  const scores = []

  const nJokers = hand.filter((x) => x.kind === "Joker").length
  const cards = hand.filter((x) => x.kind === "Regular").map(x => ({ value: x.value, color: x.color }))

  for (let start = minCardValue; start <= maxCardValue; ++start) {
    let misses = 0
    for (let stop = start; stop <= maxCardValue; ++stop) {
      if (!cards.some(({ value }) => value === stop)) ++misses;
      if (misses > nJokers) break;
      if (stop < 1) continue;
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
    nColors = Math.min(maxCardColor - minCardColor + 1, nColors + nJokers)
    if (nColors < 2) continue;
    recognised.push(`${nColors} of a kind (${val} high card)`)
    scores.push(nColors * 1000 + 200 + val)
  }

  console.log(hand, recognised)
  return Math.max(...scores)
}


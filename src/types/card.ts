import { enumFromTo, newId } from "../utilities/functional"

export type CardId = number & { _: "CardId" }
export const newCardId = () => newId() as CardId

export type Card = {
  id: CardId
  rank: number
  suit: number
} & { _: "Card" }

export const minCardRank = 1
export const maxCardRank = 13
export const cardRanks = enumFromTo(minCardRank, maxCardRank)
export const minCardSuit = 1
export const maxCardSuit = 4
export const cardSuits = enumFromTo(minCardSuit, maxCardSuit)

export const newCard: ((x: { rank: number, suit: number }) => Card) =
  ({ rank, suit }) => {
    console.assert(cardRanks.includes(rank))
    console.assert(cardSuits.includes(suit))
    return { id: newCardId(), rank, suit: suit } as Card
  }

export function compareCardsByRank(a: Card, b: Card) {
  return a.rank - b.rank || a.suit - b.suit
}

export function sortCards(cards: Card[]): Card[] {
  return cards.slice().sort(compareCardsByRank)
}

export function standardDeck(): Card[] {
  let cards: Card[] = []
  for (let suit of cardSuits) {
    for (let rank of cardRanks) {
      cards.push(newCard({ suit, rank }))
    }
  }
  return cards
}

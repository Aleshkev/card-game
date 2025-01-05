import { enumFromTo, newId } from "../utilities/functional"

export type CardId = number & { _: "CardId" }
export const newCardId = () => newId() as CardId

export type Card = {
  id: CardId
  rank: number
  color: number
} & { _: "Card" }

export const minCardRank = 1
export const maxCardRank = 13
export const cardRanks = enumFromTo(minCardRank, maxCardRank)
export const minCardColor = 1
export const maxCardColor = 4
export const cardColors = enumFromTo(minCardColor, maxCardColor)

export const newCard: ((x: { rank: number, color: number }) => Card) =
  ({ rank, color }) => {
    console.assert(cardRanks.includes(rank))
    console.assert(cardColors.includes(color))
    return { id: newCardId(), rank, color } as Card
  }

export function compareCardsByRank(a: Card, b: Card) {
  return a.rank - b.rank || a.color - b.color
}

export function sortCards(cards: Card[]): Card[] {
  return cards.slice().sort(compareCardsByRank)
}

export function standardDeck(): Card[] {
  let cards: Card[] = []
  for (let color of cardColors) {
    for (let rank of cardRanks) {
      cards.push(newCard({ color, rank }))
    }
  }
  return cards
}

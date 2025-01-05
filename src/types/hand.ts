import { bucket, enumFromTo, maxBy } from "../utilities/functional"
import { Card, cardColors, cardRanks, maxCardRank, minCardRank } from "./card"

const handKindsByValue = ["HighCard", "Straight", "NOfAkind", "StraightFlush"] as const
export type Hand = {
  kind: typeof handKindsByValue[number]
  span: number
  rank: number
  cards: Card[]
}

export function compareHands(a: Hand, b: Hand) {
  return (a.span - b.span
    || handKindsByValue.indexOf(a.kind) - handKindsByValue.indexOf(b.kind)
    || a.rank - b.rank)
}

export function sortHands(hands: Hand[]): Hand[] {
  return hands.slice().sort(compareHands)
}

export function getBestStraight(cards: Card[]): Hand | null {
  let currentBest: Card[] | null = null
  const cardsByRank = bucket(cards, ({ rank }) => rank, maxCardRank + 1)
  for (let start = minCardRank; start <= maxCardRank; ++start) {
    if (cardsByRank[start].length === 0) continue
    let stop = start + 1
    for (; stop <= maxCardRank; ++stop) {
      if (cardsByRank[stop].length === 0) break
    }
    --stop;
    const length = stop - start + 1
    if (length > 1 && (currentBest === null || currentBest.length <= length)) {
      currentBest = enumFromTo(start, stop).map(i => cardsByRank[i][0])
    }
    start = stop + 1;
  }
  if (currentBest === null) return null
  return {
    kind: "Straight", span: currentBest.length,
    rank: currentBest[currentBest.length - 1].rank,
    cards: currentBest
  }
}

export function getBestStraightFlush(cards: Card[]): Hand | null {
  const straights = sortHands(cardColors.map(fixedColor => getBestStraight(cards.filter(({ color }) => color === fixedColor))).filter(x => x !== null))
  return straights.length === 0 ? null : { ...straights[straights.length - 1], kind: "StraightFlush" }
}

export function getBestNOfAKind(cards: Card[]): Hand | null {
  let currentBest: Card[] | null = null
  const cardsByRank = bucket(cards, ({ rank }) => rank, maxCardRank + 1)
  for (let rank of cardRanks) {
    const length = cardsByRank[rank].length
    if (length > 1 && (currentBest === null || currentBest.length <= length)) {
      currentBest = cardsByRank[rank]
    }
  }
  if (currentBest === null) return null
  return {
    kind: "NOfAkind",
    span: currentBest.length,
    rank: currentBest[0].rank,
    cards: currentBest
  }
}

export function getBestHighCard(cards: Card[]): Hand {
  let best = maxBy(cards, ({ rank }) => rank)!
  return {
    kind: "HighCard",
    span: 1,
    rank: best.rank,
    cards: [best]
  }
}

export function getBestHand(cards: Card[]): Hand {
  // TODO Empty hand should probably be a thing?
  console.assert(cards.length > 0)
  const hands = [
    getBestStraight(cards),
    getBestStraightFlush(cards),
    getBestNOfAKind(cards),
    getBestHighCard(cards)
  ].filter(x => x !== null)
  hands.sort(compareHands)
  return hands[hands.length - 1]
}

export function handToString(hand: Hand) {
  switch (hand.kind) {
    case "Straight":
      return `${hand.span}-card straight (${hand.rank} high card)`
    case "StraightFlush":
      return `${hand.span}-card straight flush (${hand.rank} high card)`
    case "HighCard":
      return `${hand.rank} high card`
    case "NOfAkind":
      return `${hand.cards.length} of a kind (${hand.rank} high card)`
    // default:
    //   return `${hand.span}-card ${hand.kind} (${hand.rank} high card)`
  }
}


import { expect, test } from "vitest"
import { Card, newCard } from "./card"
import { getBestHand, getBestHighCard, getBestNOfAKind, getBestStraight, getBestStraightFlush } from "./hand"

const cardOne = newCard({ rank: 1, color: 1 })
const cardTwo = newCard({ rank: 2, color: 1 })
const cardThree = newCard({ rank: 3, color: 1 })
const cardFour = newCard({ rank: 4, color: 1 })
const getIds = (xs: Card[]) => xs.map(({ id }) => id)

test("finds a simple straight", () => {
  const cards = [cardOne, cardTwo, cardFour]
  expect(getBestStraight(cards)!.cards).toStrictEqual([cardOne, cardTwo])
})

test("finds a straight flush", () => {
  const cards = [cardOne, cardTwo, cardFour]
  expect(getBestStraightFlush(cards)!.cards).toStrictEqual([cardOne, cardTwo])
})

test("finds a straight flush and knows it's the best hand", () => {
  const cards = [cardOne, cardTwo, cardFour]
  expect(getBestHand(cards).kind).toStrictEqual("StraightFlush")
})

test("doesn't find a one-card long straight", () => {
  const cards = [cardOne, cardOne, cardFour]
  expect(getBestStraight(cards)).toStrictEqual(null)
})

test("finds a simple two of a kind", () => {
  const cards = [cardOne, cardOne, cardTwo, cardThree, cardThree]
  expect(getBestNOfAKind(cards)!.cards).toStrictEqual([cardThree, cardThree])
})

test("doesn't find a 'one of a kind'", () => {
  const cards = [cardOne, cardTwo]
  expect(getBestNOfAKind(cards)).toStrictEqual(null)
})

test("finds a high card", () => {
  const cards = [cardOne, cardFour, cardOne]
  expect(getBestHighCard(cards)!.cards).toStrictEqual([cardFour])
})


import { Card } from "./card"
import { Item } from "./item"

export type RoundState = {
  playerCards: Card[]  // Includes played hands (but they are not displayed)
  playerHand: Card[]
  playerDeck: Card[]
  playerItems: Item[]
  dealerHand: Card[]
  dealerDeck: Card[]
}

export type RoundMeta = {
  maxDealerHandSize: number
  maxPlayerHandSize: number
  idealNCardsHeldByPlayer: number
  hands: number
  items: number
}
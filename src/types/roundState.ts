import { Card } from "./card"
import { Item } from "./item"

// This is in a separate object to make sure we don't forget to reset anything
// between turns.
export type TurnState = {
  overrideDealerMaxHandSize?: number
  overridePlayerMaxHandSize?: number
}

export type RoundState = {
  playerDrawnCards: Card[]  // Includes played hands (but they are not displayed)
  playerPlayedCards: Card[]
  playerDeck: Card[]
  playerItems: Item[]
  dealerPlayedCards: Card[]
  dealerDeck: Card[]
  discardedCards: Card[]
  turn: TurnState
}

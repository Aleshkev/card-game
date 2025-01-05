import { Card } from "./card"
import { Item } from "./item"

export type RoundState = {
  playerDrawnCards: Card[]  // Includes played hands (but they are not displayed)
  playerPlayedCards: Card[]
  playerDeck: Card[]
  playerItems: Item[]
  dealerPlayedCards: Card[]
  dealerDeck: Card[]
}

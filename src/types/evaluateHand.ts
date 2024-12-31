import { Card, CardColor, CardId, CardValue, maxCardColor, maxCardValue, minCardColor, minCardValue, RegularCard, toCardValue } from "./types"

/** `null` means nothing was found. Otherwise, the list contains card ids and
 * nulls representing positions of the jokers. */
type Result = (RegularCard | null)[] | null

/** Finds the best flush (a sequence of cards with increasing values).
 * A flush is better if it is longer, and when two flushes have the same length the 
 * one with higher card values is better. Jokers can be any card.
 */
function findFlush(cards: RegularCard[], jokers: number): Result {
  let bestFlush: Result = null

  for (let start = minCardValue; start <= maxCardValue; ++start) {
    let misses = 0
    let chosen: (RegularCard | null)[] = []
    for (let stop = start; stop <= maxCardValue; ++stop) {
      let card = cards.find(card => card.value === stop)
      if (card === undefined) {
        ++misses
        chosen.push(null)
      } else {
        chosen.push(card)
      }
      if (misses > jokers) break;

      if (bestFlush === null || chosen.length > bestFlush.length) {
        // If we're here, the values have to be higher than before.
        bestFlush = chosen.slice()
      }
    }
  }
  return bestFlush
}


function findStraightFlush(cards: RegularCard[], jokers: number): Result {
  let bestFlush: Result = null
  for (let color = minCardColor; color <= maxCardColor; ++color) {
    const chosen = findFlush(cards.flatMap((card) => card.color === color ? [card] : []), jokers);
    if (chosen !== null && (bestFlush === null || chosen.length > bestFlush.length)) {
      bestFlush = chosen
    }
  }
  return bestFlush
}

/** Finds the best "N of a kind", a set of cards with same value and different 
 * colors. More cards (colors) is better. If lengths are  the same, higher value 
 * is better. */
function findNOfAKind(cards: RegularCard[], jokers: number): Result {
  let bestChosen: Result = null
  for (let value = minCardValue; value <= maxCardValue; ++value) {
    let chosen: Result = []
    for (let color = minCardColor; color <= maxCardColor; ++color) {
      let card = cards.find(card => card.value === value && card.color === color)
      if (card === undefined) continue
      chosen.push(card)
    }
    const maxNColors = maxCardColor - minCardColor + 1
    const nUsableJokers = maxNColors - chosen.length
    for (let i = 0; i <= nUsableJokers && i <= jokers; ++i) chosen.push(null)
    if (bestChosen === null || chosen.length > bestChosen.length) {
      bestChosen = chosen
    }
  }
  return bestChosen
}

function findBest(cards: Card[]): [number, Card[]] {
  const regularCards = cards.filter(card => card.kind === "Regular")
  const jokers = cards.filter(card => card.kind === "Joker")
  const bestStraightFlush = findStraightFlush(regularCards, jokers.length)
  const bestFlush = findFlush(regularCards, jokers.length)
  const bestNOfAKind = findNOfAKind(regularCards, jokers.length)
  
}

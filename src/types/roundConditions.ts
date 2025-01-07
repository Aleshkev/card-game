
export type RoundConditions = {
  maxDealerHandSize: number
  maxPlayerHandSize: number
  idealNDrawnCards: number
  idealNPlays: number
  items: number
}


export function randomRoundConditions(difficulty: number): RoundConditions {
  // BIG TODO: Randomise rounds based on difficulty.
  return {
    maxDealerHandSize: Math.min(8, 3 + difficulty),
    maxPlayerHandSize: 3,
    idealNDrawnCards: 6,
    idealNPlays: 4,
    items: 2
  }
}


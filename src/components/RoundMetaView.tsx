import { RoundMeta } from "../types/types"

export type Props = {
  roundMeta: RoundMeta
  playerLives: number
}

export function RoundMetaView({roundMeta, playerLives}: Props) {
  return <div className=" border border-black flex flex-col gap-2 p-2 m-2">
    <p>{roundMeta.idealCards} cards in hand.</p>
    <p>{roundMeta.cardsPerHand} cards in a play.</p>
    <p>{roundMeta.items} items at the start.</p>
    <p>{roundMeta.hands} plays in this round.</p>
    <p>Lives: {playerLives}</p>
  </div>
}

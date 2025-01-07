import { RoundConditions } from "../types/roundConditions"

export type Props = {
  roundConditions: RoundConditions
  playerLives: number
}

export function RoundMetaView({roundConditions, playerLives}: Props) {
  return <div className="  rounded-lg bg-gray-600 text-white flex flex-col gap-2 p-5 m-4">
    <p>The dealer plays {roundConditions.maxDealerHandSize} cards.</p>
    <p>You play at most {roundConditions.maxPlayerHandSize} cards.</p>
    <p>You have {roundConditions.idealNDrawnCards} drawn cards.</p>
    {/* <p>{roundConditions.items} items at the start.</p> */}
    {/* TODO: I think it's not worth showing, it's only good for initial calculations, right? */}
    {/* <p>There are {roundConditions.idealNPlays} plays this round.</p> */}
    <p>Lives: {playerLives}</p>
  </div>
}

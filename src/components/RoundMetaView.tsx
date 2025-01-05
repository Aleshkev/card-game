import { RoundMeta } from "../types/round"

export type Props = {
  roundMeta: RoundMeta
  playerLives: number
}

export function RoundMetaView({roundMeta, playerLives}: Props) {
  return <div className=" border border-black flex flex-col gap-2 p-2 m-2">
    <p>The dealer plays at most {roundMeta.maxDealerHandSize} cards.</p>
    <p>You play at most {roundMeta.maxPlayerHandSize} cards.</p>
    <p>You have {roundMeta.idealNDrawnCards} drawn cards.</p>
    {/* <p>{roundMeta.items} items at the start.</p> */}
    {/* TODO: I think it's not worth showing, it's only good for initial calculations, right? */}
    {/* <p>There are {roundMeta.idealNPlays} plays this round.</p> */}
    <p>Lives: {playerLives}</p>
  </div>
}

import { Card } from "../types/card";
import { compareHands, getBestHand, handToString } from "../types/hand";
import { Item } from "../types/item";
import { RoundState } from "../types/roundState";
import { RoundConditions } from "../types/roundConditions";
import { CardArrayView } from "./CardArrayView";
import { CardStack } from "./CardStack";
import { ItemArrayView } from "./ItemArrayView";

export type Props = {
  roundConditions: RoundConditions;
  roundState: RoundState;

  onPlayerSelectCard: (card: Card) => void;
  onPlayerUnselectCard: (card: Card) => void;
  allowSubmit: boolean;
  onPlayerSubmit: () => void;
  onShowDealerDeck: () => void;
  showingPlayerDeck: boolean;
  showingDealerDeck: boolean;
  onShowPlayerDeck: () => void;
  onUseItem: (item: Item) => void;
  showResult: boolean;
};

export function Board({
  roundConditions,
  roundState,
  onPlayerSelectCard,
  onPlayerUnselectCard,
  onPlayerSubmit,
  allowSubmit,
  onShowDealerDeck,
  onShowPlayerDeck,
  showingPlayerDeck,
  showingDealerDeck,
  onUseItem,
  showResult,
}: Props) {
  const playerBestHand =
    showResult && getBestHand(roundState.playerPlayedCards);
  const dealerBestHand =
    showResult && getBestHand(roundState.dealerPlayedCards);
  const result =
    playerBestHand &&
    dealerBestHand &&
    compareHands(playerBestHand, dealerBestHand);

  const dealerPlayedCards = (
    <CardArrayView
      cards={roundState.dealerPlayedCards}
      placeholders={roundConditions.maxDealerHandSize}
      highlighted={
        dealerBestHand ? dealerBestHand.cards.map(({ id }) => id) : undefined
      }
    />
  );
  const dealerDeck = (
    <CardStack
      cards={showingDealerDeck ? [] : roundState.dealerDeck}
      onClick={onShowDealerDeck}
    />
  );
  const playerPlayedCards = (
    <CardArrayView
      cards={roundState.playerPlayedCards}
      placeholders={roundConditions.maxPlayerHandSize}
      onClickCard={onPlayerUnselectCard}
      highlighted={
        playerBestHand ? playerBestHand.cards.map(({ id }) => id) : undefined
      }
    />
  );
  const playerItems = (
    <ItemArrayView items={roundState.playerItems} onClickItem={onUseItem} />
  );
  const playerDrawnCards = (
    <CardArrayView
      cards={roundState.playerDrawnCards.filter(
        (x) => roundState.playerPlayedCards.indexOf(x) === -1
      )}
      onClickCard={onPlayerSelectCard}
    />
  );
  const playerDeck = (
    <CardStack
      cards={showingPlayerDeck ? [] : roundState.playerDeck}
      onClick={onShowPlayerDeck}
    />
  );

  return (
    <div className=" h-full justify-center flex flex-col gap-20 items-stretch p-2">
      <div className="relative">
        <div className="  mx-auto flex flex-col gap-2 items-center justify-center">
          {dealerPlayedCards}
          {(dealerBestHand && <div>{handToString(dealerBestHand)}</div>) || (
            <div>&nbsp;</div>
          )}
        </div>
        <div className="absolute right-0 top-0">{dealerDeck}</div>
      </div>
      <div className="flex  flex-col items-center text-2xl">
        {(showResult && result && (
          <div>
            {result > 0
              ? "You win."
              : result === 0
                ? "Draw."
                : "You lose a life."}
          </div>
        )) || <div>&nbsp;</div>}
      </div>
      <div>
        <div className="flex flex-col justify-center gap-2 items-center">
          {playerPlayedCards}
          {(playerBestHand && <div>{handToString(playerBestHand)}</div>) || (
            <div>&nbsp;</div>
          )}
          {(roundState.playerPlayedCards.length >= 1 && allowSubmit && (
            <div onClick={onPlayerSubmit} className="underline cursor-pointer">
              Play
            </div>
          )) || <div>&nbsp;</div>}
        </div>
      </div>
      <div className=" relative">
        {/* <div className=" absolute left-0 top-0">{playerItems}</div> */}
        <div className="  flex flex-col items-center">{playerDrawnCards}</div>
        <div className=" absolute right-0 top-0">{playerDeck}</div>
      </div>
    </div>
  );
}

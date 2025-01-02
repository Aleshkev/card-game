import { Card, getScore, Item, RoundMeta, RoundState } from "../types/types";
import { CardArrayView } from "./CardArrayView";
import { CardStack } from "./CardStack";
import { CardView } from "./CardView";
import { ItemArrayView } from "./ItemArrayView";
import { ItemView } from "./ItemView";

export type Props = {
  roundMeta: RoundMeta;
  roundState: RoundState;

  onPlayerSelectCard: (card: Card) => void;
  onPlayerUnselectCard: (card: Card) => void;
  onPlayerSubmit: () => void;
  onShowDealerDeck: () => void;
  onShowPlayerDeck: () => void;
  onUseItem: (item: Item) => void;
  showResult: boolean;
};

export function Board({
  roundMeta,
  roundState,
  onPlayerSelectCard,
  onPlayerUnselectCard,
  onPlayerSubmit,
  onShowDealerDeck,
  onShowPlayerDeck,
  onUseItem,
  showResult,
}: Props) {
  const dealerHand = (
    <CardArrayView
      cards={roundState.dealerHand}
      placeholders={roundMeta.cardsPerHand}
    />
  );
  const dealerDeck = (
    <CardStack
      nCards={roundState.dealerDeck.length}
      onClick={onShowDealerDeck}
    />
  );
  const playerHand = (
    <CardArrayView
      cards={roundState.playerHand}
      placeholders={roundMeta.cardsPerHand}
      onClickCard={onPlayerUnselectCard}
    />
  );
  const playerItems = (
    <ItemArrayView items={roundState.playerItems} onClickItem={onUseItem} />
  );
  const playerCards = (
    <CardArrayView
      cards={roundState.playerCards.filter(
        (x) => roundState.playerHand.indexOf(x) === -1
      )}
      onClickCard={onPlayerSelectCard}
    />
  );
  const playerDeck = (
    <CardStack
      nCards={roundState.playerDeck.length}
      onClick={onShowPlayerDeck}
    />
  );

  return (
    <div className="flex flex-col gap-20 items-stretch p-2 max-w-[70em]">
      <div className="relative">
        <div className="  mx-auto flex gap-2 items-center justify-center">
          {dealerHand}
          {showResult && <div>Score: {getScore(roundState.dealerHand)}</div>}
        </div>
        <div className="absolute right-0 top-0">{dealerDeck}</div>
      </div>
      <div>
        <div className="flex justify-center gap-2 items-center">
          {playerHand}
          {showResult && <div>Score: {getScore(roundState.playerHand)}</div>}
          {roundState.playerHand.length >= 1 && (
            <div onClick={onPlayerSubmit} className="underline cursor-pointer">
              Play
            </div>
          )}
        </div>
      </div>
      <div className=" relative">
        <div className=" absolute left-0 top-0">{playerItems}</div>
        <div className=" mx-auto">{playerCards}</div>
        <div className=" absolute right-0 top-0">{playerDeck}</div>
      </div>
    </div>
  );
}

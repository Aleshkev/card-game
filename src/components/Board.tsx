import { Card } from "../types/card";
import { compareHands, getBestHand, handToString } from "../types/hand";
import { Item } from "../types/item";
import { RoundState } from "../types/roundState";
import { RoundConditions } from "../types/roundConditions";
import { CardArrayView } from "./CardArrayView";
import { CardDeckView } from "./CardDeckView";
import { ItemArrayView } from "./ItemArrayView";
import { Button } from "./Button";
import { AnimatePresence, motion } from "motion/react";
import { CardView } from "./CardView";
import { HandView } from "./HandView";

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
      layoutId="dealerPlayedCards"
      cards={roundState.dealerPlayedCards}
      placeholders={
        roundState.turn.overrideDealerMaxHandSize ??
        roundConditions.maxDealerHandSize
      }
      highlighted={
        dealerBestHand ? dealerBestHand.cards.map(({ id }) => id) : undefined
      }
    />
  );
  const dealerDeck = (
    <CardDeckView
      cards={showingDealerDeck ? [] : roundState.dealerDeck}
      onClick={onShowDealerDeck}
    />
  );
  const playerPlayedCards = (
    <CardArrayView
      layoutId="playerPlayedCards"
      cards={roundState.playerPlayedCards}
      placeholders={
        roundState.turn.overridePlayerMaxHandSize ??
        roundConditions.maxPlayerHandSize
      }
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
      layoutId="playerDrawnCards"
      cards={roundState.playerDrawnCards.filter(
        (x) => roundState.playerPlayedCards.indexOf(x) === -1
      )}
      onClickCard={onPlayerSelectCard}
      isFan={true}
    />
  );
  const playerDeck = (
    <CardDeckView
      cards={showingPlayerDeck ? [] : roundState.playerDeck}
      onClick={onShowPlayerDeck}
    />
  );

  return (
    <div className=" h-full  justify-evenly flex flex-col gap-2 items-stretch">
      <div className="relative">
        <div className="  grid">
          <div className=" col-start-1 row-start-1 flex justify-center">
            {dealerPlayedCards}
          </div>
          <div className="col-start-1 row-start-1 flex justify-center items-center">
            <AnimatePresence>
              {dealerBestHand && <HandView hand={dealerBestHand} />}
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute right-0 top-0 px-8">{dealerDeck}</div>
      </div>
      <div className="grid h-5">
        <div className=" col-start-1 row-start-1 flex justify-center">
          <AnimatePresence>
            {roundState.playerPlayedCards.length >= 1 && allowSubmit && (
              <motion.div
                exit={{ scale: 0.5, opacity: 0.5 }}
                transition={{ duration: 0.1 }}
                className=""
              >
                <Button onClick={onPlayerSubmit} text={"play"} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {showResult && result && (
          <div className="col-start-1 row-start-1 flex items-center justify-center text-3xl font-bold">
            {result > 0
              ? "You win."
              : result === 0
                ? "Draw."
                : "You lose a life."}
          </div>
        )}
      </div>
      <div>
        <div className="grid">
          <div className=" col-start-1 row-start-1 flex justify-center">
            {playerPlayedCards}
          </div>
          <div className=" col-start-1 row-start-1 flex justify-center items-center z-10 pointer-events-none">
            <AnimatePresence>
              {playerBestHand && <HandView hand={playerBestHand} />}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className=" relative">
        <div className=" absolute left-0 top-0 px-8">{playerItems}</div>
        <div className="  flex flex-col items-center">{playerDrawnCards}</div>
        <div className=" absolute right-0 top-0 px-8">{playerDeck}</div>
      </div>
      <div className="absolute top-[120vh] left-[50%] translate-x-[-50%]">
        {roundState.discardedCards.map((card) => (
          <CardView key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}

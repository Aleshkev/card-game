import { useEffect, useReducer, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import './App.css'
import { CardView } from "./components/CardView";
import {
  Card,
  Item,
  randomItems,
  RoundMeta,
  RoundState,
  standardDeck,
} from "./types/types";
import { CardPlaceholder } from "./components/CardPlaceholder";
import { CardStack } from "./components/CardStack";
import { RoundMetaView } from "./components/RoundMetaView";
import { Board } from "./components/Board";
import { diffById, shuffle, splitAt, take } from "./utilities/functional";
import { CardGridView } from "./components/CardGridView";
import { produce } from "immer";

type Status =
  | "BeginRound"
  | "PlayerChoosesCards"
  | "ShowPlayersDeck"
  | "ShowDealersDeck"
  | "HandResult"
  | "Death";

type GameState = {
  status: Status;
  playerLives: number;
  round: RoundState;
  roundMeta: RoundMeta;
};

type Action =
  | { kind: "BeginRound" }
  | { kind: "SelectCard"; card: Card }
  | { kind: "UnselectCard"; card: Card }
  | { kind: "GivePlayerCards" }
  | { kind: "SelectDealerCards" }
  | { kind: "ClearUsedCards" }
  | { kind: "NextRound" }
  | { kind: "UseItem"; item: Item }
  | { kind: "RemoveItem"; item: Item }
  | { kind: "ShowDealersDeck" }
  | { kind: "ShowPlayerDeck" }
  | { kind: "HideDeck" };

function reduce(state: GameState, action: Action): GameState {
  return produce(state, (draft) => {
    switch (action.kind) {
      case "BeginRound": {
        draft.status = "PlayerChoosesCards"

        // TODO this is copy pasted
        let n = Math.max(
          0,
          state.roundMeta.idealCards - state.round.playerCards.length
        );
        let [newCards, newDeck] = splitAt(state.round.playerDeck, n);

        draft.round.playerCards.push(...newCards);
        draft.round.playerDeck = newDeck;

        return
      }
      case "SelectCard": {
        if (state.status !== "PlayerChoosesCards") return;
        if (state.round.playerHand.length >= state.roundMeta.cardsPerHand)
          return;
        draft.round.playerHand.push(action.card);
        return;
      }
      case "UnselectCard": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.round.playerHand = diffById(draft.round.playerHand, [
          action.card,
        ]);
        return;
      }
      case "GivePlayerCards": {
        let n = Math.max(
          0,
          state.roundMeta.idealCards - state.round.playerCards.length
        );
        let [newCards, newDeck] = splitAt(state.round.playerDeck, n);

        draft.round.playerCards.push(...newCards);
        draft.round.playerDeck = newDeck;
        return;
      }
      case "SelectDealerCards": {
        let n = Math.max(
          0,
          state.roundMeta.cardsPerHand - state.round.dealerHand.length
        );

        let [newCards, newDeck] = splitAt(state.round.dealerDeck, n);
        draft.round.dealerHand.push(...newCards);
        draft.round.dealerDeck = newDeck;
        return;
      }
      case "ClearUsedCards": {
        draft.round.dealerHand = [];
        draft.round.playerCards = diffById(
          state.round.playerCards,
          state.round.playerHand
        );
        draft.round.playerHand = [];
        return;
      }
      case "UseItem": {
        switch (action.item.kind) {
          case "MagnifyingGlass": {
            // TODO
            // return reduce(state, { kind: "SelectDealerCards" });
            return;
          }
          case "Beer": {
            ++draft.playerLives;
            return;
          }
        }
      }
      case "RemoveItem": {
        draft.round.playerItems = diffById(state.round.playerItems, [
          action.item,
        ]);
        return;
      }
      case "NextRound": {
        let meta = state.roundMeta;
        draft.round = {
          dealerHand: [],
          dealerDeck: take(
            shuffle(standardDeck()),
            meta.cardsPerHand * meta.hands
          ),
          playerCards: [],
          playerHand: [],
          playerDeck: take(
            shuffle(standardDeck()),
            meta.cardsPerHand * meta.hands
          ),
          playerItems: [...state.round.playerItems, ...randomItems(meta.items)],
        };
        return;
      }
      case "ShowDealersDeck": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.status = "ShowDealersDeck";
        return;
      }
      case "ShowPlayerDeck": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.status = "ShowPlayersDeck";
        return;
      }
      case "HideDeck": {
        if (
          state.status !== "ShowDealersDeck" &&
          state.status !== "ShowPlayersDeck"
        )
          return;
        draft.status = "PlayerChoosesCards";
        return;
      }
    }
  });
}

function App() {
  const [state, dispatch] = useReducer(reduce, {
    status: "BeginRound",
    playerLives: 3,
    roundMeta: {
      cardsPerHand: 3,
      idealCards: 6,
      hands: 5,
      items: 3,
    },
    round: {
      dealerHand: [],
      dealerDeck: take(shuffle(standardDeck()), 12),
      playerCards: [],
      playerHand: [],
      playerDeck: take(shuffle(standardDeck()), 12),
      playerItems: randomItems(2),
    },
  });

  return (
    <div className="flex flex-row items-center min-h-[100vh] font-serif">
      <div className="">
        <RoundMetaView
          roundMeta={state.roundMeta}
          playerLives={state.playerLives}
        />
      </div>
      <div className="grow relative">
        <div className="">
          <Board
            roundMeta={state.roundMeta}
            roundState={state.round}
            onPlayerSelectCard={(card) =>
              dispatch({ kind: "SelectCard", card })
            }
            onPlayerUnselectCard={(card) => {
              dispatch({ kind: "UnselectCard", card });
            }}
            onPlayerSubmit={() => {
              dispatch({ kind: "SelectDealerCards" });

              setTimeout(() => {
                dispatch({ kind: "ClearUsedCards" });
                dispatch({ kind: "GivePlayerCards" });
              }, 1000);
            }}
            onUseItem={(item) => {
              dispatch({ kind: "RemoveItem", item });
              setTimeout(() => {
                dispatch({ kind: "UseItem", item });
              }, 500);
            }}
            onShowDealerDeck={() => dispatch({ kind: "ShowDealersDeck" })}
            onShowPlayerDeck={() => dispatch({ kind: "ShowPlayerDeck" })}
          />
        </div>
        {(state.status === "ShowDealersDeck" ||
          state.status === "ShowPlayersDeck") && (
          <div
            className=" absolute w-full h-full top-0 backdrop-blur"
            onClick={() => dispatch({ kind: "HideDeck" })}
          >
            <CardGridView
              cards={
                state.status === "ShowDealersDeck"
                  ? state.round.dealerDeck
                  : state.round.playerDeck
              }
            />
          </div>
        )}
        {state.status === "BeginRound" && (
          <div
            className="absolute w-full h-full top-0 backdrop-blur flex flex-col gap-2"
            onClick={() => dispatch({ kind: "BeginRound" })}
          >
            <p>
              Dealer's cards:
            </p>
            <CardGridView cards={state.round.dealerDeck}/>
            <p>Your cards:</p>
            <CardGridView cards={state.round.playerDeck}/>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

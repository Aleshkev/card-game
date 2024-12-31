import { useEffect, useReducer, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
// import './App.css'
import { CardView } from "./components/CardView";
import {
  Card,
  CardColor,
  CardValue,
  GameState,
  Item,
  randomItems,
  standardDeck,
} from "./types/types";
import { CardPlaceholder } from "./components/CardPlaceholder";
import { CardStack } from "./components/CardStack";
import { RoundMetaView } from "./components/RoundMetaView";
import { Board } from "./components/Board";
import { diffById, shuffle, splitAt, take } from "./utilities/functional";
import { CardGridView } from "./components/CardGridView";

type Action =
  | {
      kind: "SelectCard";
      card: Card;
    }
  | {
      kind: "UnselectCard";
      card: Card;
    }
  | {
      kind: "GivePlayerCards";
    }
  | {
      kind: "SelectDealerCards";
    }
  | {
      kind: "ClearUsedCards";
    }
  | { kind: "NextRound" }
  | {
      kind: "UseItem";
      item: Item;
    }
  | {
      kind: "RemoveItem";
      item: Item;
    }
  | { kind: "ShowDealersDeck" }
  | { kind: "ShowPlayerDeck" }
  | { kind: "HideDeck" };

function reduce(state: GameState, action: Action): GameState {
  switch (action.kind) {
    case "SelectCard": {
      if (state.round.playerHand.length >= state.roundMeta.cardsPerHand)
        return state;
      return {
        ...state,
        round: {
          ...state.round,
          playerHand: [...state.round.playerHand, action.card],
        },
      };
    }
    case "UnselectCard": {
      return {
        ...state,
        round: {
          ...state.round,
          playerHand: state.round.playerHand.filter(
            (x) => x.id !== action.card.id
          ),
        },
      };
    }
    case "GivePlayerCards": {
      let n = Math.max(
        0,
        state.roundMeta.idealCards - state.round.playerCards.length
      );
      let [newCards, newDeck] = splitAt(state.round.playerDeck, n);

      return {
        ...state,
        round: {
          ...state.round,
          playerCards: [...state.round.playerCards, ...newCards],
          playerDeck: newDeck,
        },
      };
    }
    case "SelectDealerCards": {
      let n = Math.max(
        0,
        state.roundMeta.cardsPerHand - state.round.dealerHand.length
      );
      let [newCards, newDeck] = splitAt(state.round.dealerDeck, n);
      return {
        ...state,
        round: {
          ...state.round,
          dealerHand: [...state.round.dealerHand, ...newCards],
          dealerDeck: newDeck,
        },
      };
    }
    case "ClearUsedCards": {
      const playerCards = state.round.playerCards.filter(
        (x) => state.round.playerHand.findIndex((y) => x.id === y.id) === -1
      );
      return {
        ...state,
        round: {
          ...state.round,
          dealerHand: [],
          playerCards: playerCards,
          playerHand: [],
        },
      };
    }
    case "UseItem": {
      switch (action.item.kind) {
        case "MagnifyingGlass": {
          return reduce(state, { kind: "SelectDealerCards" });
        }
        case "Beer": {
          return { ...state, playerLives: state.playerLives + 1 };
        }
      }
    }
    case "RemoveItem": {
      return {
        ...state,
        round: {
          ...state.round,
          playerItems: diffById(state.round.playerItems, [action.item]),
        },
      };
    }
    case "NextRound": {
      let meta = state.roundMeta;
      return {
        ...state,
        round: {
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
        },
      };
    }
    case "ShowDealersDeck": {
      return { ...state, showDeck: "dealer" };
    }
    case "ShowPlayerDeck": {
      return { ...state, showDeck: "player" };
    }
    case "HideDeck": {
      return { ...state, showDeck: "none" };
    }
  }
}

function App() {
  const [state, dispatch] = useReducer(reduce, {
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
    showDeck: "none",
  });

  useEffect(() => dispatch({ kind: "GivePlayerCards" }), []);

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
        {state.showDeck !== "none" && (
          <div
            className=" absolute w-full h-full top-0"
            onClick={() => dispatch({ kind: "HideDeck" })}
          >
            <CardGridView
              cards={
                state.showDeck === "dealer"
                  ? state.round.dealerDeck
                  : state.round.playerDeck
              }
              onDismiss={() => dispatch({ kind: "HideDeck" })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

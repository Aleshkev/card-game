import { useReducer } from "react";
import {
  Card,
  Item,
  randomItems,
  RoundMeta,
  RoundState,
  standardDeck,
} from "./types/types";
import { RoundMetaView } from "./components/RoundMetaView";
import { Board } from "./components/Board";
import { diffById, shuffle, take } from "./utilities/functional";
import { CardGridView } from "./components/CardGridView";
import { produce } from "immer";
import {
  discardPlayedCards,
  giveDealerCards,
  givePlayerCards,
  newRound,
} from "./types/logic";

type GameState = {
  status: Status;
  playerLives: number;
  round: RoundState;
  roundMeta: RoundMeta;
};

type Status =
  | "BeginRound"
  | "PlayerChoosesCards"
  | "ShowPlayersDeck"
  | "ShowDealersDeck"
  | "SelectingDealersCards"
  | "ShowingHandResult"
  | "RoundEnded"
  | "Death";

type Action =
  | { kind: "BeginRound" }
  | { kind: "SelectCard"; card: Card }
  | { kind: "UnselectCard"; card: Card }
  | { kind: "" }
  | { kind: "SelectDealerCards" }
  | { kind: "ShowResult" }
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
        draft.round = givePlayerCards(state.round, state.roundMeta.idealCards);
        draft.status = "PlayerChoosesCards";
        return;
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
      case "SelectDealerCards": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.round = giveDealerCards(
          state.round,
          state.roundMeta.cardsPerHand
        );
        draft.status = "SelectingDealersCards";
        return;
      }
      case "ShowResult": {
        if (state.status !== "SelectingDealersCards") return;
        draft.status = "ShowingHandResult";
        return;
      }
      case "ClearUsedCards": {
        draft.round = discardPlayedCards(draft.round);
        draft.round = givePlayerCards(draft.round, state.roundMeta.idealCards);
        if (draft.round.dealerDeck.length === 0) {
          draft.status = "RoundEnded";
        } else {
          draft.status = "PlayerChoosesCards";
        }
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
        return;
      }
      case "NextRound": {
        draft.round = newRound(state.roundMeta, state.round);
        draft.status = "BeginRound";
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
        {state.status}
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
            }}
            onUseItem={(item) => {
              dispatch({ kind: "RemoveItem", item });
              setTimeout(() => {
                dispatch({ kind: "UseItem", item });
              }, 500);
            }}
            onShowDealerDeck={() => dispatch({ kind: "ShowDealersDeck" })}
            onShowPlayerDeck={() => dispatch({ kind: "ShowPlayerDeck" })}
            showResult={state.status === "ShowingHandResult"}
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
            <p>Dealer's cards:</p>
            <CardGridView cards={state.round.dealerDeck} />
            <p>Your cards:</p>
            <CardGridView cards={state.round.playerDeck} />
          </div>
        )}
        {state.status === "SelectingDealersCards" && (
          <div
            className="absolute w-full h-full top-0 flex flex-col gap-2"
            onClick={() => dispatch({ kind: "ShowResult" })}
          >
            Click to continue
          </div>
        )}
        {state.status === "ShowingHandResult" && (
          <div
            className="absolute w-full h-full top-0 flex flex-col gap-2"
            onClick={() => dispatch({ kind: "ClearUsedCards" })}
          >
            Click to continue
          </div>
        )}
        {state.status === "RoundEnded" && (
          <div
            className="absolute w-full h-full top-0 flex flex-col gap-2"
            onClick={() => dispatch({ kind: "NextRound" })}
          >
            No cards left. New round will begin. Click to continue.
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

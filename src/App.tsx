import { useReducer } from "react";
import { RoundMetaView } from "./components/RoundMetaView";
import { Board } from "./components/Board";
import { diffById, shuffle, take } from "./utilities/functional";
import { CardGridView } from "./components/CardGridView";
import { produce } from "immer";
import {
  discardItem,
  discardPlayedCards,
  giveDealerCards,
  givePlayerCards,
  newRound,
} from "./types/logic";
import { Popup } from "./components/Popup";
import { ClickScreen } from "./components/ClickScreen";
import { Card, standardDeck } from "./types/card";
import { Item, randomItems } from "./types/item";
import { RoundState } from "./types/roundState";
import { compareHands, getBestHand } from "./types/hand";
import {
  randomRoundConditions,
  RoundConditions,
} from "./types/roundConditions";
import { AnimatePresence, motion } from "motion/react";

type GameState = {
  status: Status;
  playerLives: number;
  round: RoundState;
  roundConditions: RoundConditions;
};

type Status =
  | "BeginRound"
  | "PlayerWaitsForCards"
  | "PlayerChoosesCards"
  | "ShowPlayersDeck"
  | "ShowDealersDeck"
  | "SelectingDealersCards"
  | "ShowingHandResult"
  | "RoundEnded"
  | "Death";

type Action =
  | { kind: "BeginRound" }
  | { kind: "GiveFirstCards" }
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
        draft.status = "PlayerWaitsForCards";
        return;
      }
      case "GiveFirstCards": {
        draft.round = givePlayerCards(
          draft.round,
          draft.roundConditions.idealNDrawnCards
        );
        draft.status = "PlayerChoosesCards";
        return;
      }
      case "SelectCard": {
        if (draft.status !== "PlayerChoosesCards") return;
        if (
          draft.round.playerPlayedCards.length >=
          (draft.round.turn.overridePlayerMaxHandSize ??
            draft.roundConditions.maxPlayerHandSize)
        )
          return;
        draft.round.playerPlayedCards.push(action.card);
        return;
      }
      case "UnselectCard": {
        if (draft.status !== "PlayerChoosesCards") return;
        draft.round.playerPlayedCards = diffById(
          draft.round.playerPlayedCards,
          [action.card]
        );
        return;
      }
      case "SelectDealerCards": {
        if (draft.status !== "PlayerChoosesCards") return;
        draft.round = giveDealerCards(draft.round, draft.roundConditions);
        draft.status = "SelectingDealersCards";
        return;
      }
      case "ShowResult": {
        if (draft.status !== "SelectingDealersCards") return;

        let playerBestHand = getBestHand(draft.round.playerPlayedCards);
        let dealerBestHand = getBestHand(draft.round.dealerPlayedCards);
        let cmp = compareHands(playerBestHand, dealerBestHand);
        if (cmp >= 0) {
          // Player wins
        } else {
          --draft.playerLives;
        }

        if (draft.playerLives === 0) {
          draft.status = "Death";
        } else {
          draft.status = "ShowingHandResult";
        }
        return;
      }
      case "ClearUsedCards": {
        draft.round = discardPlayedCards(draft.round);
        draft.round.turn = {};
        draft.round = givePlayerCards(
          draft.round,
          draft.roundConditions.idealNDrawnCards
        );
        if (
          draft.round.dealerDeck.length === 0 ||
          draft.round.playerDeck.length === 0
        ) {
          draft.status = "RoundEnded";
        } else {
          draft.status = "PlayerChoosesCards";
        }
        return;
      }
      case "UseItem": {
        if (draft.status !== "PlayerChoosesCards") return;
        switch (action.item.kind) {
          case "MagnifyingGlass": {
            // TODO
            // return reduce(draft, { kind: "SelectDealerCards" });
            draft.round = giveDealerCards(draft.round, draft.roundConditions);
            draft.round = discardItem(draft.round, action.item);
            return;
          }
          case "Apple": {
            ++draft.playerLives;
            draft.round = discardItem(draft.round, action.item);
            return;
          }
          case "TrashCan": {
            for (
              let discarded = 0;
              discarded < draft.roundConditions.maxDealerHandSize;
              ++discarded
            ) {
              if (draft.round.dealerPlayedCards.length > 0) {
                draft.round.discardedCards.push(
                  draft.round.dealerPlayedCards.shift()!
                );
              } else if (draft.round.dealerDeck.length > 0) {
                draft.round.discardedCards.push(
                  draft.round.dealerDeck.shift()!
                );
              } else {
                break;
              }
            }
            draft.round = discardItem(draft.round, action.item);
            return;
          }
          case "Chain": {
            draft.round.turn.overrideDealerMaxHandSize = 1;
            while (draft.round.dealerPlayedCards.length > 1) {
              draft.round.dealerDeck.unshift(
                draft.round.dealerPlayedCards.pop()!
              );
            }
            draft.round = discardItem(draft.round, action.item);
            return;
          }
          case "Dove": {
            draft.round.turn.overridePlayerMaxHandSize = 6;
            draft.round = discardItem(draft.round, action.item);
            return;
          }

          default:
            return action.item.kind;
        }
      }
      case "RemoveItem": {
        return;
      }
      case "NextRound": {
        draft.round = newRound(draft.roundConditions, draft.round);
        draft.status = "BeginRound";
        return;
      }
      case "ShowDealersDeck": {
        if (draft.status !== "PlayerChoosesCards") return;
        draft.status = "ShowDealersDeck";
        return;
      }
      case "ShowPlayerDeck": {
        if (draft.status !== "PlayerChoosesCards") return;
        draft.status = "ShowPlayersDeck";
        return;
      }
      case "HideDeck": {
        if (
          draft.status !== "ShowDealersDeck" &&
          draft.status !== "ShowPlayersDeck"
        )
          return;
        draft.status = "PlayerChoosesCards";
        return;
      }
    }
  });
}

function App() {
  const initialRoundMeta = randomRoundConditions(0);
  const [state, dispatch] = useReducer(reduce, {
    status: "BeginRound",
    playerLives: 3,
    roundConditions: initialRoundMeta,
    round: newRound(initialRoundMeta),
  });

  console.log(state.round);

  return (
    <div
      className={`flex  items-stretch min-h-[100vh] overflow-hidden ${state.status === "Death" ? " bg-red-300" : ""}`}
    >
      <div className="absolute">
        {/* {state.status} */}
        <RoundMetaView
          roundConditions={state.roundConditions}
          playerLives={state.playerLives}
        />
      </div>
      <div className="grow relative">
        <div className={` h-full `}>
          <Board
            roundConditions={state.roundConditions}
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
            onUseItem={(item) => dispatch({ kind: "UseItem", item })}
            onShowDealerDeck={() => dispatch({ kind: "ShowDealersDeck" })}
            onShowPlayerDeck={() => dispatch({ kind: "ShowPlayerDeck" })}
            showResult={
              state.status === "ShowingHandResult" || state.status === "Death"
            }
            allowSubmit={state.status === "PlayerChoosesCards"}
            showingPlayerDeck={
              state.status === "ShowPlayersDeck" ||
              state.status === "BeginRound"
            }
            showingDealerDeck={
              state.status === "ShowDealersDeck" ||
              state.status === "BeginRound"
            }
          />
        </div>

        <AnimatePresence>
          {state.status === "BeginRound" && (
            <Popup
              // condition={}
              onDismiss={() => dispatch({ kind: "BeginRound" })}
            >
              <p>Dealer's cards:</p>
              <CardGridView cards={state.round.dealerDeck} />
              <p>Your cards:</p>
              <CardGridView cards={state.round.playerDeck} />
            </Popup>
          )}
        </AnimatePresence>
        {state.status === "PlayerWaitsForCards" && (
          <ClickScreen
            onClick={() => dispatch({ kind: "GiveFirstCards" })}
            autoClickTimeout={0.7}
          />
        )}
        {state.status === "SelectingDealersCards" && (
          <ClickScreen
            onClick={() => dispatch({ kind: "ShowResult" })}
            autoClickTimeout={0.7}
          />
        )}
        <AnimatePresence>
          {(state.status === "ShowDealersDeck" ||
            state.status === "ShowPlayersDeck") && (
            <Popup onDismiss={() => dispatch({ kind: "HideDeck" })}>
              <CardGridView
                cards={
                  state.status === "ShowDealersDeck"
                    ? state.round.dealerDeck
                    : state.round.playerDeck
                }
              />
            </Popup>
          )}
        </AnimatePresence>
        {state.status === "ShowingHandResult" && (
          <ClickScreen onClick={() => dispatch({ kind: "ClearUsedCards" })} />
        )}
        {state.status === "RoundEnded" && (
          <ClickScreen
            onClick={() => dispatch({ kind: "NextRound" })}
            label="No cards left. New round will begin. Click to continue."
          />
        )}
        <AnimatePresence>
          {state.status === "Death" && (
            <Popup onDismiss={() => {}}>
              <p>You are dead.</p>
            </Popup>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

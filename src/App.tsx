import { useReducer } from "react";
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
import { Popup } from "./components/Popup";
import { ClickScreen } from "./components/ClickScreen";
import { Card, standardDeck } from "./types/card";
import { Item, randomItems } from "./types/item";
import { RoundState } from "./types/roundState";
import { compareHands, getBestHand } from "./types/hand";
import { randomRoundConditions, RoundConditions } from "./types/roundConditions";

type GameState = {
  status: Status;
  playerLives: number;
  round: RoundState;
  roundConditions: RoundConditions;
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
        draft.round = givePlayerCards(
          state.round,
          state.roundConditions.idealNDrawnCards
        );
        draft.status = "PlayerChoosesCards";
        return;
      }
      case "SelectCard": {
        if (state.status !== "PlayerChoosesCards") return;
        if (
          state.round.playerPlayedCards.length >=
          state.roundConditions.maxPlayerHandSize
        )
          return;
        draft.round.playerPlayedCards.push(action.card);
        return;
      }
      case "UnselectCard": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.round.playerPlayedCards = diffById(
          draft.round.playerPlayedCards,
          [action.card]
        );
        return;
      }
      case "SelectDealerCards": {
        if (state.status !== "PlayerChoosesCards") return;
        draft.round = giveDealerCards(
          state.round,
          state.roundConditions.maxDealerHandSize
        );
        draft.status = "SelectingDealersCards";
        return;
      }
      case "ShowResult": {
        if (state.status !== "SelectingDealersCards") return;

        let playerBestHand = getBestHand(state.round.playerPlayedCards);
        let dealerBestHand = getBestHand(state.round.dealerPlayedCards);
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
        draft.round = givePlayerCards(
          draft.round,
          state.roundConditions.idealNDrawnCards
        );
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
        draft.round = newRound(state.roundConditions, state.round);
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
  const initialRoundMeta = randomRoundConditions(0);
  const [state, dispatch] = useReducer(reduce, {
    status: "BeginRound",
    playerLives: 3,
    roundConditions: initialRoundMeta,
    round: newRound(initialRoundMeta),
  });

  return (
    <div
      className={`flex flex-row  items-stretch min-h-[100vh] font-serif ${state.status === "Death" ? " bg-red-300" : ""}`}
    >
      <div className="">
        {state.status}
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
            onUseItem={(item) => {
              dispatch({ kind: "RemoveItem", item });
              setTimeout(() => {
                dispatch({ kind: "UseItem", item });
              }, 500);
            }}
            onShowDealerDeck={() => dispatch({ kind: "ShowDealersDeck" })}
            onShowPlayerDeck={() => dispatch({ kind: "ShowPlayerDeck" })}
            showResult={
              state.status === "ShowingHandResult" || state.status === "Death"
            }
            allowSubmit={state.status === "PlayerChoosesCards"}
          />
        </div>
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
        {state.status === "BeginRound" && (
          <Popup onDismiss={() => dispatch({ kind: "BeginRound" })}>
            <p>Dealer's cards:</p>
            <CardGridView cards={state.round.dealerDeck} />
            <p>Your cards:</p>
            <CardGridView cards={state.round.playerDeck} />
          </Popup>
        )}
        {state.status === "SelectingDealersCards" && (
          <ClickScreen onClick={() => dispatch({ kind: "ShowResult" })} />
        )}
        {state.status === "ShowingHandResult" && (
          <ClickScreen onClick={() => dispatch({ kind: "ClearUsedCards" })} />
        )}
        {state.status === "RoundEnded" && (
          <ClickScreen
            onClick={() => dispatch({ kind: "NextRound" })}
            label="No cards left. New round will begin. Click to continue."
          />
        )}
        {state.status === "Death" && (
          <Popup onDismiss={() => {}}>
            <p>You are dead.</p>
          </Popup>
        )}
      </div>
    </div>
  );
}

export default App;

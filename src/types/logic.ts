import { produce } from "immer";
import { diffById, shuffle, splitAt, take } from "../utilities/functional";
import { Card, standardDeck, minCardRank, maxCardRank, minCardSuit, maxCardSuit } from "./card";
import { randomItems, Item } from "./item";
import { RoundState } from "./roundState";
import { RoundConditions } from "./roundConditions";

function transferCards(target: Card[], source: Card[], n: number): [Card[], Card[]] {
  let [transferredCards, newSource] = splitAt(source, n)
  return [[...target, ...transferredCards], newSource]
}

export function newRound(meta: RoundConditions, previousRound?: RoundState): RoundState {
  let n = meta.maxDealerHandSize * meta.idealNPlays
  let [dealerDeck, rest] = splitAt(shuffle(standardDeck()), n)
  let playerDeck = take(rest, meta.maxPlayerHandSize * meta.idealNPlays)
  return {
    dealerPlayedCards: [],
    dealerDeck,
    playerDrawnCards: [],
    playerPlayedCards: [],
    playerDeck,
    playerItems: [...(previousRound ? previousRound.playerItems : []), ...randomItems(meta.items)],
  }
}

export function givePlayerCards(round: RoundState, targetNCards: number): RoundState {
  return produce(round, (draft) => {
    let n = Math.max(0, targetNCards - round.playerDrawnCards.length);
    [draft.playerDrawnCards, draft.playerDeck] = transferCards(draft.playerDrawnCards, draft.playerDeck, n)
  })
}

export function giveDealerCards(round: RoundState, targetNCards: number): RoundState {
  return produce(round, (draft) => {
    let n = Math.max(0, targetNCards - round.dealerPlayedCards.length);
    [draft.dealerPlayedCards, draft.dealerDeck] = transferCards(draft.dealerPlayedCards, draft.dealerDeck, n)
  })
}

export function discardPlayedCards(round: RoundState): RoundState {
  return produce(round, (draft) => {
    draft.dealerPlayedCards = [];
    draft.playerDrawnCards = diffById(draft.playerDrawnCards, draft.playerPlayedCards);
    draft.playerPlayedCards = [];
  })
}

export function discardItem(round: RoundState, item: Item): RoundState {
  return produce(round, (draft) => {
    draft.playerItems = diffById(draft.playerItems, [item]);
  })
}

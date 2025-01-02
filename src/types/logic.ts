import { produce } from "immer";
import { Card, Item, ItemId, randomItems, RoundMeta, RoundState, standardDeck } from "./types";
import { diffById, shuffle, splitAt, take } from "../utilities/functional";

function transferCards(target: Card[], source: Card[], n: number): [Card[], Card[]] {
  let [transferredCards, newSource] = splitAt(source, n)
  console.log(transferredCards)
  return [[...target, ...transferredCards], newSource]
}

export function newRound(meta: RoundMeta, previousRound?: RoundState): RoundState {
  let n = meta.cardsPerHand * meta.hands
  let [dealerDeck, rest] = splitAt(shuffle(standardDeck()), n)
  let playerDeck = take(rest, n)
  return {
    dealerHand: [],
    dealerDeck,
    playerCards: [],
    playerHand: [],
    playerDeck,
    playerItems: [...(previousRound ? previousRound.playerItems : []), ...randomItems(meta.items)],
  }
}

export function givePlayerCards(round: RoundState, targetNCards: number): RoundState {
  return produce(round, (draft) => {
    let n = Math.max(0, targetNCards - round.playerCards.length);
    [draft.playerCards, draft.playerDeck] = transferCards(draft.playerCards, draft.playerDeck, n)
  })
}

export function giveDealerCards(round: RoundState, targetNCards: number): RoundState {
  return produce(round, (draft) => {
    let n = Math.max(0, targetNCards - round.dealerHand.length);
    [draft.dealerHand, draft.dealerDeck] = transferCards(draft.dealerHand, draft.dealerDeck, n)
  })
}

export function discardPlayedCards(round: RoundState): RoundState {
  return produce(round, (draft) => {
    draft.dealerHand = [];
    draft.playerCards = diffById(draft.playerCards, draft.playerHand);
    draft.playerHand = [];
  })
}

export function discardItem(round: RoundState, item: Item): RoundState {
  return produce(round, (draft) => {
    draft.playerItems = diffById(draft.playerItems, [item]);
  })
}

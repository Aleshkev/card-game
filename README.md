# Card Game

This is a card game inspired by Buckshot Roulette and Balatro. Built using React.

## Design considerations

To avoid confusing names during development, these are terms that are used in code:

1. a "card" has a "suit" and a "rank"
1. "player's drawn cards" are cards that player holds in his hand.
2. "played cards" are cards that are played (player selects them from their drawn cards, dealer takes them from top of their deck).
3. a "hand" is a sequence of cards that is rated for value, e.g. a straight flush. It is usually a subset of played cards.
1. "ideal X" is a term used to refer to a value that is used to set some other value but won't always be set precisely. For example, "ideal number of player's drawn cards" is used to give player cards after a play but the number of player's drawn cards will be greater if the player gets cards from an item.
2. if a React component would be named the same as type, its name is suffixed with "View", e.g. "Card" and "CardView"

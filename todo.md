HoverType
  None
  Nearby
  Over

State
  groups: []
  hoverGroup: [groupId, HoverType]


PrettyFormatter
  groups: [
    { id: 'Rainbow1', x: 0, y: 0, cards: [], flipped: bool, siblingId: str }
    { id: 'Rainbow2', x: 10, y: 0, cards: [], flipped: bool, siblingId: str }
    { id: 'Feelings', x: 0, y: 10, cards: [], flipped: bool, siblingId: str }
    { id: 'Needs', x: 10, y: 10, cards: [], flipped: bool, siblingId: str }
  ]

setGroups() callback to each CardGroup
  Behaviors
    Shuffle
      re-order cards
    Split (no need for history)
      By type (feeling/need)
      By Category (not defined)
      By Size (half/half)
    Flip Cards:
      When card backs are showing:
        1. You have one deck of all cards
        2. Click top card, card moves to space to the right
      When card fronts are showing:
        1. You have one deck of all cards
        2. Click the top card, move that card to the end of the queue to reveal the next card
  give all groups
    return the full list
    we could give them the index of theirs
    and their "sibling" if part of the contract
  If I split a deck, how could I add a card to my "nearby" group?
  When I "split" I make a predictable ID
    Upsert the ID, and add the card to that deck.


onDrag
  Two highlight colors -> nearby and drop zone
  Update: hoverGroup


onDrop
  remove siblingId
  assign to group, or create a new group

Right Click Menu (desktop) / Long Hold (mobile)
  Board
    Search Cards
    Arrange by Default
    Arrange by Type
    Arrange by Category
  CardGroup
    Shuffle
    Split by Size (half/half)
    Split by Type (if multiple types in group)
    Split by Category (if multiple categories in group)
    Define (top card)
  Card
    Flip
    Define

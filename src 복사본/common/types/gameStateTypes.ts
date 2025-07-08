import type { PlaygroundFigure } from "./playgroundTypes";
import type { InventoryFigure } from "./inventoryTypes";
import type { InboxBox } from "./inboxTypes";

export type GameStateData = {
  playgroundFigures: PlaygroundFigure[];
  inventoryFigures: InventoryFigure[];
  inboxParcels: InboxBox[];
};

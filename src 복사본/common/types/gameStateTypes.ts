import type { PlaygroundFigure } from "./playgroundTypes";
import type { InventoryFigure } from "./inventoryTypes";

export type GameState = {
  playgroundFigures: PlaygroundFigure[];
  inventoryFigures: InventoryFigure[];
  inboxParcels: number;
};

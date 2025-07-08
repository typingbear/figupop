import type { PlaygroundFigure } from "./playgroundTypes";
import type { InventoryFigure } from "./inventoryTypes";

export type GameStateData = {
  playgroundFigures: PlaygroundFigure[];
  inventoryFigures: InventoryFigure[];
  inboxParcels: number;
};

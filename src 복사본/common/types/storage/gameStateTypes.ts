import type { Entity } from "../game/playgroundTypes";
import type { InventoryFigure } from "../game/inventoryTypes";

export type GameState = {
  playgroundFigures: Entity[];
  inventoryFigures: InventoryFigure[];
  inboxParcels: number;
};

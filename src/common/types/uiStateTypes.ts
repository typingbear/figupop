// types/uiStateTypes.ts
export type InventorySortType = "name" | "recent" | "registered";
export type UIState = {
  inventoryOpen: boolean,
  inventoryView: "grid" | "list",
  inventorySort: InventorySortType,
  catalogOpen: boolean,
  sfxVolume: number,
  bgmVolume: number,
};
export const defaultUIState: UIState = {
  inventoryOpen: true,
  inventoryView: "grid",
  inventorySort: "recent",
  catalogOpen: false,
  sfxVolume: 80,
  bgmVolume: 60,
};

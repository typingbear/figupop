export type InventorySortType = "name" | "recent" | "registered";

const uiState: {
  inventoryOpen: boolean,
  inventoryView: "grid" | "list",
  inventorySort: InventorySortType,
  catalogOpen: boolean,
} = {
  inventoryOpen: true,
  inventoryView: "grid",
  inventorySort: "recent",    // ← 이름순, 원하는 값으로
  catalogOpen: false,
};

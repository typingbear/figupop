export type AddOrUnlockResult = "new-figure" | "new-mode" | "old";
export type InventoryFigure = {
  id: string;
  currentMode: string;
  unlockedModes: string[];
  openedAt: string;    // ← 필수!
};

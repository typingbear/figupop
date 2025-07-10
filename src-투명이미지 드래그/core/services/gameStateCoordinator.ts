import { getInventoryFigures } from "./gameStateService.js";
import { getFigureById } from "./figureLibraryService.js";
import { InventorySortType } from "../../common/types/uiStateTypes.js";

/**
 * 정렬 옵션에 맞는 인벤토리 피규어 배열 반환
 * @param sortType "recent"|"registered"|"name"
 */
/**
 * 정렬 옵션에 맞는 인벤토리 피규어 배열 반환
 */
export function getSortedInventoryFigures(sortType: InventorySortType = "registered") {
  const figures = [...getInventoryFigures()];

  switch (sortType) {
    case "recent":
      figures.sort((a, b) => (b.openedAt || "").localeCompare(a.openedAt || ""));
      break;
    case "name":
      figures.sort((a, b) => {
        const nameA = getFigureById(a.id)?.name || "";
        const nameB = getFigureById(b.id)?.name || "";
        return nameA.localeCompare(nameB, "en");
      });
      break;
    case "registered":
    default:
      figures.sort((a, b) => (a.openedAt || "").localeCompare(b.openedAt || ""));
      break;
  }
  return figures;
}
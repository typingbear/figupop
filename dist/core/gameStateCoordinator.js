import { getInventoryFigures } from "./services/gameStateService.js";
import { getFigureById } from "./services/figureLibraryService.js";
/**
 * 정렬 옵션에 맞는 인벤토리 피규어 배열 반환
 * @param sortType "recent"|"registered"|"name"
 */
/**
 * 정렬 옵션에 맞는 인벤토리 피규어 배열 반환
 */
export function getSortedInventoryFigures(sortType = "registered") {
    const figures = [...getInventoryFigures()];
    switch (sortType) {
        case "recent":
            figures.sort((a, b) => (b.openedAt || "").localeCompare(a.openedAt || ""));
            break;
        case "name":
            figures.sort((a, b) => {
                var _a, _b;
                const nameA = ((_a = getFigureById(a.id)) === null || _a === void 0 ? void 0 : _a.name) || "";
                const nameB = ((_b = getFigureById(b.id)) === null || _b === void 0 ? void 0 : _b.name) || "";
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

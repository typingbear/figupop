import { getInventoryFigures } from "./gameStateService.js";
import { getFigureById, getPrimeFigures } from "./figureLibraryService.js";
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
export function pickRandomUnownedPrimeFigure() {
    const ownedIds = new Set(getInventoryFigures().map(f => f.id));
    const unownedPrimes = getPrimeFigures().filter(f => !ownedIds.has(f.id));
    if (unownedPrimes.length === 0)
        return null;
    return unownedPrimes[Math.floor(Math.random() * unownedPrimes.length)];
}
// [함수] 키워드로 인벤토리+이름 부분검색
export function searchInventoryFiguresByName(keyword) {
    const kw = keyword.trim().toLowerCase();
    if (!kw)
        return []; // 키워드 없으면 빈 배열
    // 1. 내 인벤토리 전체
    const myInventory = getInventoryFigures();
    // 2. 전체 FIGURE_LIST에서 이름에 키워드 포함된 것만 추림
    const filtered = myInventory
        .map(inv => {
        const meta = getFigureById(inv.id);
        return meta && meta.name.toLowerCase().includes(kw)
            ? Object.assign(Object.assign({}, inv), meta) : null;
    })
        .filter(Boolean);
    return filtered;
}

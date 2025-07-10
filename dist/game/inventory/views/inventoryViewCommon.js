import { getSortedInventoryFigures } from "../../../core/services/gameStateCoordinator.js";
import { getUIState } from "../../../core/services/uiStateService.js";
export function getSortedInventory() {
    const sortType = getUIState("inventorySort");
    return getSortedInventoryFigures(sortType);
}

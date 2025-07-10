import { InventorySortType } from "../../../common/types/uiStateTypes.js";
import { getSortedInventoryFigures } from "../../../core/services/gameStateCoordinator.js";
import { getUIState } from "../../../core/services/uiStateService.js";

export function getSortedInventory() {
  const sortType = getUIState("inventorySort") as InventorySortType;
  return getSortedInventoryFigures(sortType);
}

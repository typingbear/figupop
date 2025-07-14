// config.ts
export const GAME_STATE_STORAGE_KEY = "figupop-game-state";
export const UI_STATE_STORAGE_KEY = "figupop-ui-state";
export const FIGURE_KIND_FOR_PARCEL = 'prime';
export const PARCEL_TIME = 1;
export const PARCEL_LIMIT = 5;
export const DEFAULT_UI_STATE = {
    inventoryOpen: false,
    inventoryView: "grid",
    inventorySort: "name",
    catalogOpen: false, // ← 추가!
    soundSfxVolume: 80, // 효과음 볼륨 (0~100)
    soundBgmVolume: 60, // 배경음 볼륨 (0~100)
};
/** 주요 DOM 요소 ID를 상수로 정의 */
export const ID_PLAYGROUND = "playground";
export const ID_INBOX = "inbox";
export const ID_CATEGORY = "catalog-content";
export const ID_INVENTORY = "inventory";
export const IMAGE_ROOT = "assets/images/";
export const OUTLINE_IMAGE_BASE = "assets/images/outline/";
export const AUDIO_ROOT = "assets/audio/";
export const OUTLINE_IMAGE_SUFFIX = "outline";
export const SPRITE_IMG_BASE = "assets/sprites/";
export const DEFAULT_AUDIO = "default.mp3";
export const NEW_FIGURE_AUDIO = "new_figure.mp3";
export const OLD_FIGURE_AUDIO = "old_figure.mp3";
export const UNLOCK_FIGURE_AUDIO = "unlock_figure.mp3";
export const NEW_FIGURE_EFFECT = "twirl";
export const BOX_FINISH = "assets/ui/locked.png";
export const BOX_EMPTY = "assets/ui/box_empty.png";
export const BOX_ARRIVED = "assets/ui/box_arrived.png";
// 인벤토리 - 뷰 전환 토글 버튼용 이미지
export const INVENTORY_GRID_ENABLED_IMG = "assets/ui/grid_enable.png";
export const INVENTORY_GRID_DISABLED_IMG = "assets/ui/grid_disable.png";
export const INVENTORY_LIST_ENABLED_IMG = "assets/ui/list_enabled.png";
export const INVENTORY_LIST_DISABLED_IMG = "assets/ui/list_disable.png";
// playground.css하고 맞춰야함
export const FIGURE_MAX_SIZE = {
    pc: 80,
    tablet: 70,
    mobile: 50
};

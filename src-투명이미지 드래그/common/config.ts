// config.ts
export const GAME_STATE_STORAGE_KEY = "figupop-game-state";
export const UI_STATE_STORAGE_KEY   = "figupop-ui-state";

export const FIGURE_KIND_FOR_PARCEL = 'prime';

export const  PARCEL_TIME = 3;
export const  PARCEL_LIMIT = 5;

export const DEFAULT_UI_STATE = {
  inventoryOpen: false,
  inventoryView: "grid",
  inventorySort: "name",
  catalogOpen: false,     // ← 추가!
};

/** 주요 DOM 요소 ID를 상수로 정의 */
export const ID_PLAYGROUND = "playground";
export const ID_INBOX = "inbox";
export const ID_CATEGORY = "catalog";
export const ID_INVENTORY = "inventory";


export const IMAGE_ROOT = "assets/images/";
export const OUTLINE_IMAGE_BASE = "assets/images/outline/";
export const AUDIO_ROOT = "assets/audio/";
export const OUTLINE_IMAGE_SUFFIX = "outline";
export const SPRITE_IMG_BASE = "assets/sprites/";


export const DEFAULT_AUDIO = "assets/audio/default.mp3";
export const NEW_FIGURE_AUDIO = "assets/audio/new_figure.mp3";
export const OLD_FIGURE_AUDIO = "assets/audio/old_figure.mp3";
export const UNLOCK_FIGURE_AUDIO = "assets/audio/unlock_figure.mp3";

export const LOCKED_IMG = "assets/ui/locked.png";
export const BOX_EMPTY = "assets/ui/box_empty.png";
export const BOX_ARRIVED = "assets/ui/box_arrived.png";
// 인벤토리 - 뷰 전환 토글 버튼용 이미지
export const INVENTORY_GRID_ENABLED_IMG   = "assets/ui/grid_enable.png";
export const INVENTORY_GRID_DISABLED_IMG  = "assets/ui/grid_disable.png";
export const INVENTORY_LIST_ENABLED_IMG   = "assets/ui/list_enabled.png";
export const INVENTORY_LIST_DISABLED_IMG  = "assets/ui/list_disable.png";





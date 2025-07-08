// config.ts

export const IMAGE_ROOT = "assets/images/";
export const AUDIO_ROOT = "assets/audio/";
export const DEFAULT_AUDIO = "assets/audio/default.mp3";
export const NEW_FIGURE_AUDIO = "assets/audio/newfigure.mp3";
export const LOCKED_IMG = "assets/ui/locked.png";
export const BOX_EMPTY = "assets/ui/box_empty.png";
export const BOX_ARRIVED = "assets/ui/box_arrived.png";

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


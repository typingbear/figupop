// src/services/gameStateService.js

import { GAME_STATE_STORAGE_KEY, PARCEL_LIMIT } from "../../common/config.js";
import { AddOrUnlockResult, InventoryFigure } from "../../common/types/game/inventoryTypes.js";
import { Entity } from "../../common/types/game/playgroundTypes.js";
import { GameState } from "../../common/types/storage/gameStateTypes.js";
import { gameStates } from "../../data/initialGameState.js";

// --- 내부 상태 변수 (전역적 싱글턴)
let data: GameState = loadFromStorage();

// --- 유틸
export function saveToGameStateStorage() {
  localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage(): GameState {
  const str = localStorage.getItem(GAME_STATE_STORAGE_KEY);
  if (str) {
    try {
      const obj = JSON.parse(str);
      if (typeof obj.inboxParcels !== "number") obj.inboxParcels = 0;
      return obj;
    } catch {
      return { ...gameStates };
    }
  }
  return { ...gameStates };
}

// === [공개 API 함수들] ===

// 전체 반환
export function getGameState() { return data; }

// [플레이그라운드 관련]
export function getPlaygroundFigures(): Entity[] { return data.playgroundFigures; }
export function addPlaygroundFigure(figure: Entity) {
  data.playgroundFigures.push(figure);
  saveToGameStateStorage();
}

export function removePlaygroundFigureBySerial(serial: string) {
  data.playgroundFigures = data.playgroundFigures.filter(f => f.serial !== serial);
  saveToGameStateStorage();
}
export function getMaxZIndex(): number {
  if (!data.playgroundFigures.length) return 0;
  return Math.max(...data.playgroundFigures.map(f => f.zIndex ?? 0));
}

export function bringFigureToFront(serial: string) {
  const figures = getPlaygroundFigures();
  const maxZ = getMaxZIndex();
  const fig = figures.find(f => f.serial === serial);
  if (fig) {
    fig.zIndex = maxZ + 1;
    saveToGameStateStorage();
    return fig.zIndex;
  }
  return undefined;
}

export function clearPlaygroundFigures() {
  data.playgroundFigures = [];
  saveToGameStateStorage();
}

// [인벤토리 관련]
export function getInventoryFigures(): InventoryFigure[] { return data.inventoryFigures; }

export function getUnlockedModes(figureId: string): string[] {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  return entry ? entry.unlockedModes : [];
}

export function isModeUnlocked(figureId: string, mode: string): boolean {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  return !!entry && entry.unlockedModes.includes(mode);
}


export function addOrUnlockInventoryFigure(
  figureId: string,
  mode: string
): AddOrUnlockResult {
  let entry = data.inventoryFigures.find(f => f.id === figureId);

  if (!entry) {
    // 신규 피규어 추가: openedAt도 기록!
    entry = {
      id: figureId,
      currentMode: mode,
      unlockedModes: [mode],
      openedAt: new Date().toISOString() // ← 여기!
    };
    data.inventoryFigures.push(entry);
    saveToGameStateStorage();
    return "new-figure";
  }

  if (entry.unlockedModes.includes(mode)) {
    return "old";
  }

  entry.unlockedModes.push(mode);
  saveToGameStateStorage();
  return "new-mode";
}

// [인박스(택배) 관련]

// 현재 남은 택배 개수 반환
export function getInboxParcels(): number {
  return data.inboxParcels;
}

// 택배 개수 설정 (최소/최대 보정)
export function setInboxParcels(count: number) {
  data.inboxParcels = Math.max(0, Math.min(count, PARCEL_LIMIT));
  saveToGameStateStorage();
}

// 0으로 리셋
export function clearInboxParcels() {
  data.inboxParcels = 0;
  saveToGameStateStorage();
}



// [초기화]
export function resetGameState() {
  data = {
    playgroundFigures: [],
    inventoryFigures: [],
    inboxParcels: 0
  };
  saveToGameStateStorage();
}
export function resetToInitialState() {
  data = JSON.parse(JSON.stringify(gameStates));
  saveToGameStateStorage();
}

// src/services/gameStateService.js

import type { InboxBox, GameStateData, PlaygroundFigure, InventoryFigure } from "../common/types.js";
import { GAME_STATE_STORAGE_KEY } from "../common/config.js";
import { INITIAL_GAME_STATE } from "../data/initialGameState.js";

// --- 내부 상태 변수 (전역적 싱글턴)
let data: GameStateData = loadFromStorage();

// --- 유틸
export function saveToStorage() {
  localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(data));
}

function loadFromStorage(): GameStateData {
  const str = localStorage.getItem(GAME_STATE_STORAGE_KEY);
  if (str) {
    try {
      const obj = JSON.parse(str);
      if (!('inboxParcels' in obj)) obj.inboxParcels = [null, null, null, null, null];
      return obj;
    } catch {
      // 파싱 실패시 초기값
      return { ...INITIAL_GAME_STATE };
    }
  }
  return { ...INITIAL_GAME_STATE };
}

// === [공개 API 함수들] ===

// 전체 반환
export function getGameState() { return data; }

// [플레이그라운드 관련]
export function getPlaygroundFigures(): PlaygroundFigure[] { return data.playgroundFigures; }
export function addPlaygroundFigure(figure: PlaygroundFigure) {
  data.playgroundFigures.push(figure);
  saveToStorage();
}
export function removePlaygroundFigure(id: string) {
  data.playgroundFigures = data.playgroundFigures.filter(f => f.id !== id);
  saveToStorage();
}
export function removePlaygroundFigureBySerial(serial: string) {
  data.playgroundFigures = data.playgroundFigures.filter(f => f.serial !== serial);
  saveToStorage();
}
export function getMaxZIndex(): number {
  if (!data.playgroundFigures.length) return 0;
  return Math.max(...data.playgroundFigures.map(f => f.zIndex ?? 0));
}

// [인벤토리 관련]
export function getInventoryFigures(): InventoryFigure[] { return data.inventoryFigures; }
export function addInventoryFigure(fig: InventoryFigure) {
  data.inventoryFigures.push(fig);
  saveToStorage();
}
export function removeInventoryFigure(id: string) {
  data.inventoryFigures = data.inventoryFigures.filter(f => f.id !== id);
  saveToStorage();
}
export function hasFigure(figureId: string): boolean {
  return data.inventoryFigures.some(f => f.id === figureId);
}
export function getUnlockedModes(figureId: string): string[] {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  return entry ? entry.unlockedModes : [];
}
export function unlockFigureMode(figureId: string, mode: string) {
  let entry = data.inventoryFigures.find(f => f.id === figureId);
  if (!entry) {
    entry = { id: figureId, currentMode: mode, unlockedModes: [mode] };
    data.inventoryFigures.push(entry);
  } else {
    if (!entry.unlockedModes.includes(mode)) {
      entry.unlockedModes.push(mode);
    }
  }
  saveToStorage();
}
export function isModeUnlocked(figureId: string, mode: string): boolean {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  return !!entry && entry.unlockedModes.includes(mode);
}
export function getCurrentMode(figureId: string): string | undefined {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  return entry?.currentMode;
}
export function setCurrentMode(figureId: string, mode: string) {
  const entry = data.inventoryFigures.find(f => f.id === figureId);
  if (entry && entry.unlockedModes.includes(mode)) {
    entry.currentMode = mode;
    saveToStorage();
  }
}

// [인박스 관련]
export function getInboxParcels(): InboxBox[] { return data.inboxParcels; }
export function setInboxParcel(idx: number, figureId: string | null) {
  if (idx >= 0 && idx < 5) {
    data.inboxParcels[idx] = figureId;
    saveToStorage();
  }
}
export function clearInboxParcels() {
  data.inboxParcels = [null, null, null, null, null];
  saveToStorage();
}

// [초기화]
export function resetGameState() {
  data = { playgroundFigures: [], inventoryFigures: [], inboxParcels: [null, null, null, null, null] };
  saveToStorage();
}
export function resetToInitialState() {
  data = JSON.parse(JSON.stringify(INITIAL_GAME_STATE));
  saveToStorage();
}

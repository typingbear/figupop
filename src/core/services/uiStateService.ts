import { UI_STATE_STORAGE_KEY } from "../../common/config.js";
import { UIState, defaultUIState } from "../../common/types/storage/uiStateTypes.js"; // defaultUIState 꼭 import

// 내부 상태 캐시
let state: UIState = loadUIState();

function loadUIState(): UIState {
  try {
    const raw = localStorage.getItem(UI_STATE_STORAGE_KEY);
    if (raw) return { ...defaultUIState, ...JSON.parse(raw) };
    return { ...defaultUIState };
  } catch {
    return { ...defaultUIState };
  }
}

function saveUIState() {
  localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function getUIState<K extends keyof UIState>(key: K): UIState[K] {
  return (key in state) ? state[key] : defaultUIState[key];
}

// **여기를 더 안전하게 고침**
export function setUIState<K extends keyof UIState>(key: K, value: UIState[K]): void {
  state = { ...state, [key]: value };
  saveUIState();
}

export function getAllUIState(): UIState {
  return { ...state };
}

export function setAllUIState(newState: Partial<UIState>): void {
  state = { ...defaultUIState, ...newState };
  saveUIState();
}

export function resetUIState(): void {
  state = { ...defaultUIState };
  saveUIState();
}

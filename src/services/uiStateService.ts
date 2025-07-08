import { UI_STATE_STORAGE_KEY, DEFAULT_UI_STATE } from "../common/config.js";

type UIState = typeof DEFAULT_UI_STATE;

// 내부 상태 캐시
let state: UIState = loadUIState();

function loadUIState(): UIState {
  try {
    const raw = localStorage.getItem(UI_STATE_STORAGE_KEY);
    if (raw) return { ...DEFAULT_UI_STATE, ...JSON.parse(raw) };
    return { ...DEFAULT_UI_STATE };
  } catch {
    return { ...DEFAULT_UI_STATE };
  }
}

function saveUIState() {
  localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state));
}

export function getUIState<K extends keyof UIState>(key: K): UIState[K] {
  return (key in state) ? state[key] : DEFAULT_UI_STATE[key];
}

export function setUIState<K extends keyof UIState>(key: K, value: UIState[K]): void {
  state[key] = value;
  saveUIState();
}

export function getAllUIState(): UIState {
  return { ...state };
}

export function setAllUIState(newState: Partial<UIState>): void {
  state = { ...DEFAULT_UI_STATE, ...newState };
  saveUIState();
}

export function resetUIState(): void {
  state = { ...DEFAULT_UI_STATE };
  saveUIState();
}

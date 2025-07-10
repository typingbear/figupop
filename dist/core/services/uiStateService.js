import { UI_STATE_STORAGE_KEY, DEFAULT_UI_STATE } from "../../common/config.js";
// 내부 상태 캐시
let state = loadUIState();
function loadUIState() {
    try {
        const raw = localStorage.getItem(UI_STATE_STORAGE_KEY);
        if (raw)
            return Object.assign(Object.assign({}, DEFAULT_UI_STATE), JSON.parse(raw));
        return Object.assign({}, DEFAULT_UI_STATE);
    }
    catch (_a) {
        return Object.assign({}, DEFAULT_UI_STATE);
    }
}
function saveUIState() {
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state));
}
export function getUIState(key) {
    return (key in state) ? state[key] : DEFAULT_UI_STATE[key];
}
export function setUIState(key, value) {
    state[key] = value;
    saveUIState();
}
export function getAllUIState() {
    return Object.assign({}, state);
}
export function setAllUIState(newState) {
    state = Object.assign(Object.assign({}, DEFAULT_UI_STATE), newState);
    saveUIState();
}
export function resetUIState() {
    state = Object.assign({}, DEFAULT_UI_STATE);
    saveUIState();
}

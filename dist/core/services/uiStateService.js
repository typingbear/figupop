import { UI_STATE_STORAGE_KEY } from "../../common/config.js";
import { defaultUIState } from "../../common/types/storage/uiStateTypes.js"; // defaultUIState 꼭 import
// 내부 상태 캐시
let state = loadUIState();
function loadUIState() {
    try {
        const raw = localStorage.getItem(UI_STATE_STORAGE_KEY);
        if (raw)
            return Object.assign(Object.assign({}, defaultUIState), JSON.parse(raw));
        return Object.assign({}, defaultUIState);
    }
    catch (_a) {
        return Object.assign({}, defaultUIState);
    }
}
function saveUIState() {
    localStorage.setItem(UI_STATE_STORAGE_KEY, JSON.stringify(state));
}
export function getUIState(key) {
    return (key in state) ? state[key] : defaultUIState[key];
}
// **여기를 더 안전하게 고침**
export function setUIState(key, value) {
    state = Object.assign(Object.assign({}, state), { [key]: value });
    saveUIState();
}
export function getAllUIState() {
    return Object.assign({}, state);
}
export function setAllUIState(newState) {
    state = Object.assign(Object.assign({}, defaultUIState), newState);
    saveUIState();
}
export function resetUIState() {
    state = Object.assign({}, defaultUIState);
    saveUIState();
}

import { AUDIO_ROOT } from "./config.js";
import { getUIState } from "../core/services/uiStateService.js"; // 볼륨값 가져오기
//serialKey 생성 함수
export function makeSerialKey() {
    return `s${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}
export function playSound(src) {
    var _a;
    try {
        const audio = new Audio(AUDIO_ROOT + src);
        const sfxVolume = (_a = getUIState("sfxVolume")) !== null && _a !== void 0 ? _a : 80; // 0~100 (퍼센트)
        audio.volume = sfxVolume / 100; // 0~1로 변환
        audio.play();
    }
    catch (e) {
        // 재생 실패 무시
    }
}
export function formatTimer(seconds) {
    const m = ("0" + Math.floor(seconds / 60)).slice(-2);
    const s = ("0" + (seconds % 60)).slice(-2);
    return `${m}:${s}`;
}
export function getDeviceType() {
    const w = window.innerWidth;
    if (w <= 768)
        return "mobile";
    if (w <= 1100)
        return "tablet";
    return "pc";
}

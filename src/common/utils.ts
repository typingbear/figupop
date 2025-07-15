import { AUDIO_ROOT } from "./config.js";
import { getUIState } from "../core/services/uiStateService.js"; // 볼륨값 가져오기

//serialKey 생성 함수
export function makeSerialKey() {
  return `s${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}


export function playSound(src: string) {
  try {
    const audio = new Audio( src);
    const sfxVolume = getUIState("sfxVolume") ?? 80; // 0~100 (퍼센트)
    audio.volume = sfxVolume / 100; // 0~1로 변환
    audio.play();
  } catch (e) {
    // 재생 실패 무시
  }
}

 export function  formatTimer(seconds: number) {
    const m = ("0" + Math.floor(seconds / 60)).slice(-2);
    const s = ("0" + (seconds % 60)).slice(-2);
    return `${m}:${s}`;
  }

export function getDeviceType(): "pc" | "tablet" | "mobile" {
  const w = window.innerWidth;
  if (w <= 768) return "mobile";
  if (w <= 1100) return "tablet";
  return "pc";
}

export function getRenderedSize(imgEl: HTMLImageElement): { width: number; height: number } {
  const rect = imgEl.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
  };
}

export function showConfirmDialog(message: string, onConfirm: () => void) {
  const dialog = document.createElement("div");
  dialog.className = "custom-confirm-dialog";
  dialog.innerHTML = `
    <div class="custom-confirm-content">
      <div class="custom-confirm-message">${message}</div>
      <div class="custom-confirm-actions">
        <button class="custom-confirm-btn confirm">Confirm</button>
        <button class="custom-confirm-btn cancel">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(dialog);
  dialog.querySelector(".confirm")?.addEventListener("click", () => {
    document.body.removeChild(dialog);
    onConfirm();
  });
  dialog.querySelector(".cancel")?.addEventListener("click", () => {
    document.body.removeChild(dialog);
  });
}

//serialKey 생성 함수
export function makeSerialKey() {
  return `s${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

// src/common/utils.ts 또는 적절한 유틸 파일에
export function playSound(src: string) {
  try {
    const audio = new Audio(src);
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


// 랜덤 3개 추출
export function pickRandom<T>(arr: T[], n: number): T[] {
  return arr.slice().sort(() => Math.random() - 0.5).slice(0, n);
}

// 겹침 체크
export function isOverlap(el1: HTMLElement, el2: HTMLElement): boolean {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

// 사운드
let soundCache: Record<string, HTMLAudioElement> = {};
export function playSound(url: string | undefined) {
  if (!url) return;
  if (!soundCache[url]) soundCache[url] = new Audio(url);
  soundCache[url].currentTime = 0;
  soundCache[url].play();
}

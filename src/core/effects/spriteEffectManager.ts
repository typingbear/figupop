import { SPRITE_IMG_BASE } from "../../common/config.js";
import { spritesEffects } from "../../data/spritsEffects.js";

export type EffectOptions = {
  size?: number;
  /** 이펙트의 '중심 x좌표' (px, body 기준) */
  centerX?: number;
  /** 이펙트의 '중심 y좌표' (px, body 기준) */
  centerY?: number;
};

/**
 * 스프라이트 이펙트 재생 함수 (body에만 붙임, centerX/centerY)
 */
export function playSpriteEffect(
  effectName: string,
  options: EffectOptions = {}
): void {
  const effect = spritesEffects[effectName];
  if (!effect) {
    console.warn(`효과 ${effectName}를 찾을 수 없음!`);
    return;
  }

  // 프레임 경로 배열 생성
  const frames: string[] = [];
  for (let i = 1; i <= effect.frames; i++) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    frames.push(`${SPRITE_IMG_BASE}${effectName}_${numStr}.png`);
  }

  // 이미지 요소 생성
  const img = document.createElement("img");
  img.className = "sprite-effect";

  // 옵션에 따른 사이즈
  if (options.size) {
    img.style.width = img.style.height = `${options.size}px`;
  }

  // 옵션에 따른 중심 좌표
  if (
    typeof options.centerX === "number" &&
    typeof options.centerY === "number"
  ) {
    img.style.left = `${options.centerX}px`;
    img.style.top = `${options.centerY}px`;
  }

  document.body.appendChild(img);

  let frame = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  const update = () => {
    img.src = frames[frame];
    frame++;
    if (frame >= frames.length) {
      if (effect.loop) {
        frame = 0;
      } else {
        if (interval) clearInterval(interval);
        img.remove();
      }
    }
  };
  update();
  interval = setInterval(update, effect.frameTime);
}

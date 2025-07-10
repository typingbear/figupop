import { SPRITE_IMG_BASE } from "../../common/config.js";
import { spritesEffects } from "../../data/spritsEffects.js";
export class SpriteEffectManager {
    static play(effectName, target, options) {
        // 효과 정보 가져오기
        const effect = spritesEffects[effectName];
        if (!effect) {
            console.warn(`효과 ${effectName}를 찾을 수 없음!`);
            return;
        }
        // 프레임 경로 배열 만들기
        const frames = [];
        for (let i = 1; i <= effect.frames; i++) {
            const numStr = i < 10 ? `0${i}` : `${i}`;
            frames.push(`${SPRITE_IMG_BASE}${effectName}_${numStr}.png`);
        }
        // 이미지 요소 생성
        const img = document.createElement("img");
        img.style.position = "absolute";
        img.style.pointerEvents = "none";
        img.style.width = img.style.height = ((options === null || options === void 0 ? void 0 : options.size) || 128) + "px";
        // === x/y 좌표로 위치 지정 ===
        if (typeof (options === null || options === void 0 ? void 0 : options.x) === "number" && typeof (options === null || options === void 0 ? void 0 : options.y) === "number") {
            img.style.left = `${options.x}px`;
            img.style.top = `${options.y}px`;
            img.style.transform = "translate(-50%, -50%)";
        }
        else {
            // 중앙(default)
            img.style.left = "50%";
            img.style.top = "50%";
            img.style.transform = "translate(-50%, -50%)";
        }
        img.style.zIndex = "9999";
        target.appendChild(img);
        let frame = 0;
        let interval = null;
        const update = () => {
            img.src = frames[frame];
            frame++;
            if (frame >= frames.length) {
                if (effect.loop) {
                    frame = 0;
                }
                else {
                    clearInterval(interval);
                    img.remove();
                }
            }
        };
        update();
        interval = setInterval(update, effect.frameTime);
    }
}

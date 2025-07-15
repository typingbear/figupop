
import { enablePlaygroundDnD } from "./dnd/playgroundDnD.js";
import { enablePlaygroundDrop } from "./dnd/playgroundDrop.js";
import { renderPlayground } from "./playgroundRenderer.js";

export class PlaygroundManager {
  constructor() {
    renderPlayground();        // 플레이그라운드 첫 렌더
    enablePlaygroundDnD();     // DnD(마우스 드래그) 이벤트 바인딩
    enablePlaygroundDrop();    // 드래그-드롭 이벤트 바인딩
  }
}


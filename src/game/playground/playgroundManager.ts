import {
  getPlaygroundFigures,
  removePlaygroundFigureBySerial,
} from "../../services/gameStateService.js";
import { renderPlayground } from "./render/playgroundRenderer.js";
import { enablePlaygroundDnD } from "./dnd/playgroundDnD.js";
import { enablePlaygroundDrop } from "./dnd/playgroundDrop.js";
import type { PlaygroundFigure } from "../../common/types.js";

export class PlaygroundManager {
  private container: HTMLElement;

  constructor() {
    const el = document.getElementById("playground");
    if (!el) throw new Error("#playground 컨테이너가 존재하지 않습니다.");
    this.container = el;

    this.render(); // 최초 1회

    enablePlaygroundDnD(this.container, this.refresh.bind(this));

    // 외부 드롭 통합(Universal) - 필요 시 추가
     enablePlaygroundDrop(this.container, () => this.refresh());
  }

  /** UI 전체 새로고침 (Renderer에게 위임) */
  render() {
    const figures: PlaygroundFigure[] = getPlaygroundFigures().slice();

    renderPlayground(
 
      (serial: string) => {
        // 우클릭 삭제 시 콜백
        removePlaygroundFigureBySerial(serial);
        this.refresh();
      }
    );
  }

  /** 외부에서 호출 가능한 새로고침 (이벤트용) */
  refresh() {
    this.render();
  }
}

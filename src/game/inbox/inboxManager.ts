// inboxManager.ts
import { renderInbox } from "./render/inboxRenderer.js";
import {
  subscribeInboxParcel,
  startInboxParcel,
  getParcelCount,
  removeParcelAndSpawn,
} from "./parcel/inboxParcelManager.js";  // <-- 전부 소문자!



export class InboxManager {
  private inboxPanel: HTMLElement | null = document.getElementById("inbox");

  constructor() {
    subscribeInboxParcel(() => this.render());
    startInboxParcel();
    this.render();
  }


  private handleBoxClick = () => {
    if (getParcelCount() > 0) {
      removeParcelAndSpawn();
    }
  };

  render() {
    renderInbox(); // 더 이상 인자 필요 없음!
  }

}


import { InboxParcelManager } from "./parcel/InboxParcelManager.js";
import { renderInbox } from "./render/inboxRenderer.js";  // 이거만 남김!
import { enableInboxToPlayDrag } from "./dnd/toPlaygroundDrag.js";

export class InboxManager {
  private inboxPanel: HTMLElement | null = document.getElementById("inbox");
  private parcelManager: InboxParcelManager;

  constructor() {
    this.parcelManager = new InboxParcelManager();
    this.parcelManager.subscribe(() => this.render());
    this.parcelManager.start();
    this.render();
  }

  private formatTimer(seconds: number) {
    const m = ("0" + Math.floor(seconds / 60)).slice(-2);
    const s = ("0" + (seconds % 60)).slice(-2);
    return `${m}:${s}`;
  }

  render() {
    if (!this.inboxPanel) return;
    renderInbox(
      this.inboxPanel,
      this.parcelManager.getBoxes(),
      this.formatTimer(this.parcelManager.getCountdown()),
      (boxesWrap) => enableInboxToPlayDrag(boxesWrap, () => this.render())
    );
  }
}

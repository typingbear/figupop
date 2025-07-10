// inboxManager.ts
import { renderInbox } from "./render/inboxRenderer.js";
import {
  subscribeInboxParcel,
  startInboxParcel,
  getParcelCount,
  removeParcelAndSpawn,
} from "./parcel/inboxParcelManager.js";  // <-- 전부 소문자!
import { ID_INBOX } from "../../common/config.js";



export class InboxManager {
  private inboxPanel: HTMLElement | null = document.getElementById(ID_INBOX);

  constructor() {
    subscribeInboxParcel(() =>renderInbox());
    startInboxParcel();
    renderInbox();
  }

}


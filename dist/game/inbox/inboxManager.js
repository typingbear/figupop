// inboxManager.ts
import { renderInbox } from "./render/inboxRenderer.js";
import { subscribeInboxParcel, startInboxParcel, } from "./parcel/inboxParcelManager.js"; // <-- 전부 소문자!
import { ID_INBOX } from "../../common/config.js";
export class InboxManager {
    constructor() {
        this.inboxPanel = document.getElementById(ID_INBOX);
        subscribeInboxParcel(() => renderInbox());
        startInboxParcel();
        renderInbox();
    }
}

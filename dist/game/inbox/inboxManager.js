// inboxManager.ts
import { renderInbox } from "./render/inboxRenderer.js";
import { subscribeInboxParcel, startInboxParcel, getParcelCount, removeParcelAndSpawn, } from "./parcel/inboxParcelManager.js"; // <-- 전부 소문자!
export class InboxManager {
    constructor() {
        this.inboxPanel = document.getElementById("inbox");
        this.handleBoxClick = () => {
            if (getParcelCount() > 0) {
                removeParcelAndSpawn();
            }
        };
        subscribeInboxParcel(() => this.render());
        startInboxParcel();
        this.render();
    }
    render() {
        renderInbox(); // 더 이상 인자 필요 없음!
    }
}

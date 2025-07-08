import {
  getInboxParcels,
  setInboxParcel,
} from "../../../services/gameStateService.js";
import { getFiguresByKind } from "../../../services/figureLibraryService.js";
import { PARCEL_TIME, FIGURE_KIND_FOR_PARCEL } from "../../../common/config.js";

type InboxBox = string | null;

export class InboxParcelManager {
  static PARCEL_FIGURES = getFiguresByKind(FIGURE_KIND_FOR_PARCEL);

  private deliveryCountdown = PARCEL_TIME;
  private intervalId: number | null = null;
  private onChange: (() => void) | null = null;

  subscribe(cb: () => void) {
    this.onChange = cb;
  }

  start() {
    console.log("START: intervalId=", this.intervalId, "deliveryCountdown=", this.deliveryCountdown);
    if (this.intervalId !== null) return;
    if (this.deliveryCountdown <= 0) this.deliveryCountdown = PARCEL_TIME;
    this.intervalId = window.setInterval(() => this.tick(), 1000);
  }

  stop() {
    console.log("STOP: intervalId=", this.intervalId);
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    if (this.isFull()) {
      this.stop();
      return;
    }
    this.deliveryCountdown--;
    this.onChange?.();

    if (this.deliveryCountdown <= 0) {
      this.addRandomParcel();
      this.deliveryCountdown = PARCEL_TIME;
      if (this.isFull()) this.stop();
      this.onChange?.();
    }
  }

  getCountdown() {
    // 가득 차면 0초로!
    if (this.isFull()) return 0;
    return this.deliveryCountdown;
  }


  getBoxes(): InboxBox[] {
    return getInboxParcels();
  }

  addRandomParcel() {
    const boxes = this.getBoxes();
    const emptyIdx = boxes.findIndex(box => box === null);
    if (emptyIdx === -1 || InboxParcelManager.PARCEL_FIGURES.length === 0) return;
    const fig = InboxParcelManager.PARCEL_FIGURES[Math.floor(Math.random() * InboxParcelManager.PARCEL_FIGURES.length)];
    setInboxParcel(emptyIdx, fig.id);
    this.onChange?.();
  }

  removeParcel(idx: number) {
    console.log("removeParcel CALLED for idx", idx);

    const boxes = this.getBoxes();
    if (idx >= 0 && idx < boxes.length) {
      setInboxParcel(idx, null);
      if (!this.isFull()) {
        this.deliveryCountdown = PARCEL_TIME;
        this.start();
      }
      this.onChange?.();
    }
  }

  isFull() {
    return this.getBoxes().every(box => box !== null);
  }
  isEmpty() {
    return this.getBoxes().every(box => box === null);
  }
}

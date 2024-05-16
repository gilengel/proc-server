import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export class Drop extends Vue {
  @Prop({
    validator(x) {
      return typeof x === "string" && x !== "";
    },
  })
  dataKey!: string;

  @Prop() element!: HTMLElement;

  drop?: (e: DragEvent) => void;

  dragOver?: (e: DragEvent) => void;

  dragEnter?: (e: DragEvent) => void;

  dragLeave?: (e: DragEvent) => void;

  mounted() {
    this.registerDropListeners();
  }

  beforeDestroy() {
    this.unregisterDropListeners();
  }

  private isDropAllowed(event: DragEvent): boolean {
    const el = event.target as HTMLElement;
    const allowedDropClass = event.dataTransfer?.getData("allowed_drop_class");

    if (!allowedDropClass) {
      throw new Error(`allowed_drop_class is not set on the event.dataTransfer`)
    }

    for (let elClass of allowedDropClass.split(',')) {
      if (el.classList.contains(elClass)) {
        return true;
      }
    }

    return false;
    //return allowedDropClass !== undefined && el.classList.contains(allowedDropClass);
  }

  dragOverEvent(event: DragEvent) {
    const el = event.target as HTMLElement;
    const allowedDropClass = event.dataTransfer?.getData("allowed_drop_class");

    // Allow drop if the target has the allowed
    // drop class specified by the Drag mixin
    if (this.isDropAllowed(event)) {
      event.preventDefault();
    }

    if (this.dragOver) {
      this.dragOver(event)
    }
  }

  dragEnterEvent(event: DragEvent) {
    const el = event.target as HTMLElement;

    if (this.isDropAllowed(event)) {
      el.classList.add("drop-allowed");
    }

    if (this.dragEnter) {
      this.dragEnter(event)
    }
  }

  dragLeaveEvent(event: DragEvent) {
    const el = event.target as HTMLElement;
    el.classList.remove("drop-allowed")

    if (this.dragLeave) {
      this.dragLeave(event)
    }
  }

  dropEvent(event: DragEvent) {
    const el = event.target as HTMLElement;
    el.classList.remove("drop-allowed");

    if (this.drop) {
      this.drop(event)
    }
  }

  registerDropListeners() {
    const el = this.element === undefined ? this.$el as HTMLElement : this.element;
    el.addEventListener('dragover', this.dragOverEvent)
    el.addEventListener('dragenter', this.dragEnterEvent)
    el.addEventListener('dragleave', this.dragLeaveEvent)
    el.addEventListener('drop', this.dropEvent)
  }

  unregisterDropListeners() {
    const el = this.element === undefined ? this.$el as HTMLElement : this.element;
    el.removeEventListener('dragover', this.dragOverEvent)
    el.removeEventListener('dragenter', this.dragEnterEvent)
    el.removeEventListener('dragleave', this.dragLeaveEvent)
    el.removeEventListener('drop', this.dropEvent)
  }

}

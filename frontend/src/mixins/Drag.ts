import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export class Drag extends Vue {
  @Prop({
    validator(x) {
      return typeof x === "string" && x !== "";
    },
  })
  dataKey!: string;

  @Prop({
    validator(x) {
      return typeof x === "string" && x !== "";
    },
  })
  dataValue!: string;

  @Prop({
    validator(x) {
      if (x.length == 0) {
        return false;
      }

      for (let i of x) {

        if (i !== "string" && i === "") {
          return false;
        }
      }

      return true;
    },
  })
  dropTargetClass!: Array<string>;

  @Prop() dragEnd?: (e: DragEvent) => void;

  mounted() {
    this.registerDragListeners();
  }

  beforeDestroy() {
    this.unregisterDragListeners();
  }

  dragStart(event: DragEvent) {
    this.$el.classList.add("dragging");

    event.dataTransfer?.setData("allowed_drop_class", this.dropTargetClass.join(','))
    event.dataTransfer?.setData(this.dataKey, this.dataValue)
  }

  dragEndEvent(event: DragEvent) {
    this.$el.classList.remove("dragging");

    if (this.dragEnd) {
      this.dragEnd(event)
    }
  }

  registerDragListeners() {
    const el = this.$el as HTMLElement;
    el.addEventListener('dragstart', this.dragStart)
    el.addEventListener('dragend', this.dragEndEvent)
  }

  unregisterDragListeners() {
    const el = this.$el as HTMLElement;
    el.removeEventListener('dragstart', this.dragStart)
    el.removeEventListener('dragend', this.dragEndEvent)
  }

}

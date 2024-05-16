import { Vue, Component, Prop } from "vue-property-decorator";
import { Action } from "vuex-class";
import { v4 as uuidv4 } from "uuid";


@Component
export class Selectable extends Vue {

  @Action("removeAllSelectedElementsAndModels")
  clearSelectedElements!: () => void;

  @Action("addSelectedElementAndModel")
  addSelectedElement!: (param: { element: string, model: any, clearPreviousSelected: boolean }) => void;

  /**
   * Used as a reference for the list of selected elements. can be anything except null or undefined
   *
   * @type {string}
   * @memberof Selectable
   */
  @Prop({
    validator(x) {
      return x !== null && x !== undefined;
    },
  })
  model!: any;

  mounted() {
    this.registerListeners();

    this.$el.id = uuidv4();
  }

  beforeDestroy() {
    this.unregisterListeners();
  }

  clickEvent(event: MouseEvent) {
    event.stopPropagation()

    this.addSelectedElement({ element: (this.$el as HTMLElement).id, model: this.model, clearPreviousSelected: !event.ctrlKey })
  }

  bodyClickEvent(event: MouseEvent) {
    //console.log(event)
  }

  registerListeners() {
    (this.$el as HTMLElement).addEventListener('click', this.clickEvent)
    document.body.addEventListener('click', this.bodyClickEvent);
  }

  unregisterListeners() {
    (this.$el as HTMLElement).removeEventListener('click', this.clickEvent)
    document.body.addEventListener('click', this.bodyClickEvent);
  }

}

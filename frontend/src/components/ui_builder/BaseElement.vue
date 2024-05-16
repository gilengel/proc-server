<script lang="ts">
import { Element, ElementAttribute } from 'src/layouts/FormModel'
import { Prop } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import IModel from '../../store/Model'
import { mixins } from "vue-class-component";

import { Selectable } from '../../mixins/Selectable'
import { ElementConnection } from 'src/models/Grid';

export default class BaseElement extends mixins(Selectable) {
  @Prop({ default: 'uuid' }) uuid!: string

  @Getter('element')
  getElement!: (uuid: string) => Element

  @Action('updateElementAttributes')
  updateElementAttribute!: (param: { element: Element, name: string, value: any}) => void

  @Action('setConnectionValue')
  setConnectionValue!: (param: { connection: ElementConnection, value: any}) => void

  protected getValueOfAttribute(name: String): any {
    const element = this.model as unknown as Element;
    const attribute = element.attributes.find(attribute => attribute.name === name) as ElementAttribute;

    if(attribute === undefined) {
      return undefined;
    }

    return (attribute === undefined) ? undefined : attribute.value
  }

  protected setValueOfAttribute(name: string, value: any): any {
      this.updateElementAttribute({ element: this.model, name: name, value: value })
  }
}
</script>

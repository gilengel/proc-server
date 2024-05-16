import { Vue, Component, Prop } from 'vue-property-decorator'

import { NodeEditor, Node as ReteNode } from 'rete'

@Component
export default class extends Vue {
  @Prop(NodeEditor) emitter: NodeEditor | undefined;
  @Prop(String) propertyKey: string | undefined;
  @Prop(Function) getData: unknown
  @Prop(Function) putData: unknown
  @Prop({ type: Function, default: () => { return true } }) isValid!: (e: unknown) => true
  @Prop() node!: ReteNode;

  public getValue<T>(): T {
    const property = (this.getData as (v: string) => unknown)(this.propertyKey as string) as T

    if (property === undefined) {
      throw new Error(`could not get value for number control since the property with key ${this.propertyKey as string} is not specified as data on the node`)
    }

    return property
  }
}

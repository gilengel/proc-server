import { Node, NodeEditor } from 'rete'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { DirectiveOptions } from 'vue'

interface Foo extends Vue {
  bindSocket (el: HTMLElement, arg: string | undefined, value: unknown): void
  bindControl (el: HTMLElement, value: unknown): void

}

const Socket: DirectiveOptions = {
  bind (el, binding, vnode) {
    (vnode.context as Foo).bindSocket(el, binding.arg, binding.value)
  },
  update (el, binding, vnode) {
    (vnode.context as Foo).bindSocket(el, binding.arg, binding.value)
  }
}

const Control: DirectiveOptions = {
  bind (el, binding, vnode) {
    if (!binding.value) return

    (vnode.context as Foo).bindControl(el, binding.value)
  }
}

@Component({
  directives: {
    socket: Socket,
    control: Control
  }
})
export default class Mixin extends Vue {
  @Prop(Node) node!: Node
  @Prop(NodeEditor) editor!: NodeEditor
  @Prop() bindSocket!: undefined
  @Prop() bindControl!: undefined

  inputs () {
    return Array.from(this.node.inputs.values())
  }

  outputs () {
    return Array.from(this.node.outputs.values())
  }

  controls () {
    return Array.from(this.node.controls.values())
  }

  selected() {
    return this.editor.selected.contains(this.node) ? 'selected' : ''
  }
}

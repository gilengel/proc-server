<template>
  <div class="flow-graph-container column">
    <q-toolbar>
      <q-toolbar-title>
        {{title}}
      </q-toolbar-title>
    </q-toolbar>
    <div class="flow" v-resize="onResize">
      <div id="rete" ref="rete"></div>
    </div>
  </div>
</template>

<script lang="ts">
import 'regenerator-runtime/runtime'
import { Vue, Component, Prop } from 'vue-property-decorator'
import Rete, { Engine, NodeEditor } from 'rete'

import ConnectionPlugin from 'rete-connection-plugin'
import VueRenderPlugin from 'src/components/flow/plugins/render/Index'

import DockPlugin from 'src/components/flow/plugins/dock/Index'
import { MetaFlowCategory } from 'src/components/flow/components/Index'

import resize from 'vue-resize-directive'

@Component({
  directives: {
    resize
  }
})
export default class FlowGraphComponent extends Vue {
  @Prop({
    validator: (x) => typeof x === "string" && x.length > 0,

    default: "Notes"
  })
  title?: string;

  @Prop(Object) geometry: Record<string, unknown> | undefined;
  @Prop() readonly nodes!: Array<MetaFlowCategory>;

  editor!: NodeEditor;
  engine!: Engine;

  createEditor () {
    const container = this.$refs.rete
    this.editor = new Rete.NodeEditor('demo@0.1.0', container as HTMLElement)

    this.editor.use(ConnectionPlugin)
    this.editor.use(VueRenderPlugin)
    this.editor.use(DockPlugin)

  }

  createCustomEditorEvents () {
    this.editor.bind('previewnode')
  }

  registerComponents () {
    for (const category of this.nodes) {
      category.components.map((c) => {
        this.editor.register(c.component)
        this.engine.register(c.component)
      })
    }
  }

  registerEditorEvents () {

    this.editor.on(['process', 'nodecreated', 'noderemoved', 'connectioncreated', 'connectionremoved'], async () => {
      await this.engine.abort()
      await this.engine.process(this.editor.toJSON())
    })

    this.editor.on(['import'], async () => {
      await this.engine.abort()
      await this.engine.process(this.editor.toJSON())
    })

    this.editor.on(['keyup'], async (e: KeyboardEvent) => {
      this.keyUpEvent(e)

      await this.engine.process(this.editor.toJSON())
    })

    this.editor.on(['zoom'], async ({transform, zoom}) => {

    })
  }

  mounted () {

    this.createEditor()
    this.createCustomEditorEvents()

    this.engine = new Rete.Engine('demo@0.1.0')
    this.registerComponents()

    this.registerEditorEvents()

    this.editor.view.resize()
    this.editor.trigger('process');
  }

  keyUpEvent (e: KeyboardEvent) {
    if (
      e.code === 'Delete' &&
      (e.target as HTMLElement).tagName.toUpperCase() !== 'INPUT'
    ) {
      this.editor.selected.each((n) => this.editor.removeNode(n))
    }
  }

  width = 0;
  height = 0;

  onResize (e : HTMLElement) {
    this.width = e.scrollWidth // - (e.scrollWidth % 50)
    this.height = e.scrollHeight // - (e.scrollHeight % 50)

    if (this.width !== e.scrollWidth || this.height !== e.scrollHeight) {
      this.editor.view.resize()
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-graph-container {
  height: 100%;
  //border: solid 4px white;

  position: relative;

  .flow {
    position: relative;
    //background: lime;
    width: 100%;

    flex-grow: 1;

    #rete {
      position: absolute;

      //background: white;

      width: 100% !important;
      height: 100% !important;
    }
  }
}
</style>

<template>
  <div class="flow-editor">
    <q-splitter v-model="leftWidth" style="height: 100%" v-if="dock && dockPosition == 'left'">
      <template v-slot:before><FlowEditorDock :title="dockTitle" :nodes="nodes" /></template>
      <template v-slot:after><FlowGraphComponent :title="flowTitle" :nodes="nodes" /></template>
    </q-splitter>

    <q-splitter v-model="leftWidth" style="height: 100%" v-if="dock && dockPosition == 'right'">
      <template v-slot:before><FlowGraphComponent :title="flowTitle" :nodes="nodes" /></template>
      <template v-slot:after><FlowEditorDock :title="dockTitle" /></template>
    </q-splitter>
    <!--
    <FlowGraphComponent :nodes="availableComponentCategories" v-else />
    -->
  </div>
</template>

<script lang="ts">
import FlowGraphComponent from './FlowGraphComponent.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import { MetaFlowCategory } from 'src/components/flow/components/Index'

import FlowEditorDock from './FlowEditorDock.vue'



@Component({
  components: {
    FlowEditorDock,
    FlowGraphComponent
  }
})
export default class MapEditorComponent extends Vue {
  // Minimal size for one column
  @Prop({
    validator: (x) => typeof x === "boolean",

    default: true
  })
  dock!: boolean;

  @Prop({
    validator: (x) => ['left', 'right'].includes(x),

    default: 'left'
  })
  dockPosition!: string;

  @Prop({
    validator: (x) => typeof x === "number" && x >= 10 && x <= 90,

    default: 20
  })
  dockWidth!: number;

  @Prop({
    validator: (x) => typeof x === "string" && x.length > 0,

    default: "Nodes"
  })
  dockTitle?: string;

  @Prop({
    validator: (x) => typeof x === "string" && x.length > 0,

    default: "Flow"
  })
  flowTitle?: string;

  leftWidth: number = 0;

  @Prop({
    validator: (x) => x && Array.isArray(x) && x.length > 0
  })
  nodes!: Array<MetaFlowCategory>

  mounted() {
    this.leftWidth = this.dockPosition === 'left' ? this.dockWidth : 100 - this.dockWidth

  }
}
</script>

<style lang="scss">
.flow-editor {
  width: 100%;
  height: 100%;
}

.connection {
  .main-path {
    fill: none;
    stroke-width: 5px;
    stroke: $primary;
  }
}
</style>

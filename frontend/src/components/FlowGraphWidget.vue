<template>
  <Widget
    title="Flow"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <q-splitter v-model="leftToolbar" style="height: 100%">
      <template #before>
        <FlowGraphNodesList :nodes="nodes" />
      </template>

      <template #after>
        <FlowGraphComponent
          :graph="graph"
          :nodes="nodes"
          v-html=""
        />
      </template>
    </q-splitter>
  </Widget>
</template>

<script lang="ts">
import FlowGraphComponent from "./flow/FlowGraphComponent.vue";
import { Component, Prop } from "vue-property-decorator";

import { MetaFlowCategory } from 'components/flow/components/Index'

import FlowGraphNodesList from "./FlowGraphNodesList.vue";
import Widget from "./Widget.vue";
import { Node as ReteNode } from "rete";

@Component({
  name: "FlowGraphWidget",

  components: {
    FlowGraphNodesList,
    FlowGraphComponent,
  },
})
export default class FlowGraphWidget extends Widget {
  @Prop() readonly nodes!: Array<MetaFlowCategory>;
  @Prop() graph!: Array<ReteNode>;

  left = true;

  horizontalSplitter = 70;

  verticalSplitter = 50;

  // width of left toolbar
  leftToolbar = 20;

  // width of right toolbar
  rightToolbar = 50;
}
</script>

<style lang="scss" scoped>
</style>

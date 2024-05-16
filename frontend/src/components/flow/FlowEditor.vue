<template>
  <div class="flow-editor">
    <q-splitter v-model="leftWidth" style="height: 100%">
      <template v-slot:before
        ><FlowEditorDock :title="props.dockTitle" :nodes="props.nodes"
      /></template>
      <template v-slot:after>
        <!--<FlowGraphComponent :title="flowTitle" :nodes="nodes" />-->
        <h1>Muu</h1>
      </template>
    </q-splitter>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import FlowEditorDock from './FlowEditorDock.vue';
import { MetaFlowCategory } from './components/Index';

export interface FlowEditorProps {
  dock?: boolean;
  dockPosition?: string;
}

let leftWidth = ref(400);

let props = withDefaults(defineProps<FlowEditorProps>(), {
  dock: true,
  dockPosition: 'left',
  dockTitle: 'Dock',
  nodes: Array as PropType<Array<MetaFlowCategory>>,
});
</script>

<style scoped></style>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>MIMAYU Builder</q-toolbar-title>

        <div>based on Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <!--
      <FlowEditor :nodes="nodes" :dockWidth="10" flowTitle="Graph" />
      -->
      <!--<FlowGraph />-->
      <WidgetLayout :grid />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { useGridModuleStore } from '../stores/gridModule';

const gridModuleStore = useGridModuleStore();

const grid: Grid = gridModuleStore.grid as Grid;

import { Grid } from 'src/models/Grid';
//import FlowGraph from '../components/flow/FlowGraph.vue';
import WidgetLayout from '../components/ui_builder/WidgetLayout.vue';

//import FlowEditor from '../components/flow/FlowGraph.vue';

//import { getRegisteredComponentCategories } from 'src/components/flow/components/Index';
//import FlowEditor from '../components/flow/FlowEditor.vue';
//import { ref } from 'vue';

//const nodes = ref(getRegisteredComponentCategories());
//console.log(nodes);
//import PageList from '../components/Pagelist.vue';
</script>

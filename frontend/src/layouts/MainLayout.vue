<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Page Builder</q-toolbar-title>
        <q-btn
          flat
          round
          dense
          :disable="!undoRedoStore.hasUnduable()"
          icon="las la-undo-alt"
          @click="undoRedoStore.undo()"
        />

        <q-btn
          flat
          round
          dense
          :disable="!undoRedoStore.hasReduable()"
          icon="las la-redo-alt"
          @click="undoRedoStore.redo()"
        />

        <div>based on Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <FlowEditor />
      <!--
      <Suspense>
        <WidgetLayout :grid />
      </Suspense>
    -->
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
//import { useGridModuleStore } from '../stores/gridModule';
import { useUndoRedoStore } from '../stores/undoredo';

import FlowEditor from 'src/components/flow/FlowEditor.vue';

//const gridModuleStore = useGridModuleStore();
const undoRedoStore = useUndoRedoStore();

//const grid: Grid = gridModuleStore.grid as Grid;

//import { Grid } from 'src/models/Grid';

//import WidgetLayout from '../components/ui_builder/WidgetLayout.vue';
</script>

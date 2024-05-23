<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Page Builder</q-toolbar-title>
        <q-tabs inline-label v-model="tab" class="text-white">
          <q-tab name="layout" icon="las la-th-list" label="Layout" />
          <q-tab name="logic" icon="las la-project-diagram" label="Logic" />
        </q-tabs>
        <q-space />
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

        <div>{{ tab === 'layout' }} based on Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <Suspense>
        <WidgetLayout :grid v-show="tab === 'layout'" />
      </Suspense>

      <FlowEditor
        v-show="tab == 'logic'"
        :elements
        :categories="[basicCategory]"
        :grid="{ enabled: true, size: 20 }"
      />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
export enum FormInputOutput {
  Input = 'Input',
  Output = 'Output',
}
</script>
<script setup lang="ts">
import * as uuid from 'uuid';
import { computed, ref } from 'vue';
import { MetaFlowCategory } from 'src/components/flow';

import FlowEditor from 'src/components/flow/FlowEditor.vue';
import WidgetLayout from 'src/components/ui_builder/WidgetLayout.vue';

import { useGridModuleStore } from 'src/stores/gridModule';
import { useUndoRedoStore } from 'src/stores/undoredo';

import {
  Grid,
  Element,
  ElementType,
  ElementAttributeType,
} from 'src/models/Grid';

const gridModuleStore = useGridModuleStore();
const undoRedoStore = useUndoRedoStore();

const tab = ref('logic');

const grid: Grid = gridModuleStore.grid as Grid;

const elements = computed(() => {
  const els: Element[] = [];
  for (const row of grid.rows) {
    for (const column of row.columns) {
      if (!column.element) {
        continue;
      }

      els.push(column.element);
    }
  }

  return els;
});

type FormType = ElementType | FormInputOutput;

const basicCategory: MetaFlowCategory<FormType, ElementAttributeType> = {
  label: 'Basic',
  icon: '',

  elements: [
    {
      type: FormInputOutput.Input,
      label: 'Input',
      icon: 'las la-download',
      defaultElement: {
        type: FormInputOutput.Input,
        uuid: uuid.v4(),
        outputs: [
          {
            type: ElementAttributeType.String,
            identifier: 'Text',
            children: [],
          },
        ],
      },
    },
    {
      type: FormInputOutput.Output,
      label: 'Output',
      icon: 'las la-upload',
      defaultElement: {
        type: FormInputOutput.Output,
        uuid: uuid.v4(),
        inputs: [
          {
            type: ElementAttributeType.String,
            identifier: 'Text',
            children: [],
          },
        ],
      },
    },
    {
      type: ElementType.Text,
      label: 'Text',
      icon: 'las la-comment-dots',
      defaultElement: {
        type: ElementType.Text,
        uuid: uuid.v4(),
        inputs: [
          {
            type: ElementAttributeType.String,
            identifier: 'Text',
            children: [],
          },
        ],
        outputs: [
          {
            type: ElementAttributeType.String,
            identifier: 'Text',
            children: [],
          },
        ],
      },
    },
  ],
};
</script>

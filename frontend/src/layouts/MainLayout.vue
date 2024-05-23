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

      <!-- TODO remove the "e as Element" cast and use proper types -->
      <FlowEditor
        v-show="tab == 'logic'"
        :elements
        :sockets="basicSockets"
        :categories="[basicCategory]"
        :grid="{ enabled: true, size: 20 }"
        :createDataForNewElement="(e) => e as Element"
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
import { ComputedRef, computed, ref } from 'vue';
import { MetaFlowCategory, MetaFlowElement } from 'src/components/flow';

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
import { ElementPin } from 'src/components/flow/model';

const gridModuleStore = useGridModuleStore();
const undoRedoStore = useUndoRedoStore();

const tab = ref('logic');

const grid: Grid = gridModuleStore.grid as Grid;

const elements: ComputedRef<Element[]> = computed(() => {
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

function createDefaultElement<T extends string>(
  type: T,
  label: string,
  icon: string,
  inputs: ElementPin<ElementAttributeType>[] = [],
  outputs: ElementPin<ElementAttributeType>[] = [],
): MetaFlowElement<T, ElementAttributeType> {
  return {
    type,
    label,
    icon,
    defaultElement: {
      type,
      uuid: uuid.v4(),
      inputs,
      outputs,
    },
  };
}

function createDefaultPin<T extends string>(
  type: T,
  identifier: string,
): ElementPin<T> {
  return {
    type,
    identifier,
  };
}

const basicSockets = Object.keys(ElementAttributeType);

const basicCategory: MetaFlowCategory<FormType, ElementAttributeType> = {
  label: 'Basic',
  icon: '',

  elements: [
    createDefaultElement(
      FormInputOutput.Input,
      'Input',
      'las la-download',
      [],
      [createDefaultPin(ElementAttributeType.String, 'Text')],
    ),

    createDefaultElement(
      FormInputOutput.Output,
      'Output',
      'las la-upload',
      [createDefaultPin(ElementAttributeType.String, 'Text')],
      [],
    ),
    createDefaultElement(
      ElementType.Text,
      'Text',
      'las la-comment-dots',
      [createDefaultPin(ElementAttributeType.String, 'Text')],
      [createDefaultPin(ElementAttributeType.String, 'Text')],
    ),
  ],
};
</script>

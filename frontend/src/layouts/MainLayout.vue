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
        <WidgetLayout
          :grid
          v-show="tab === 'layout'"
          @onElementChanged="(element) => elementChanged(element)"
        />
      </Suspense>

      <FlowEditor
        ref="flowEditor"
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
import { ComputedRef, Ref, computed, ref } from 'vue';
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
import { ComponentExposed } from 'vue-component-type-helpers';

const gridModuleStore = useGridModuleStore();
const undoRedoStore = useUndoRedoStore();

const tab = ref('logic');

const flowEditor: Ref<
  | ComponentExposed<typeof FlowEditor<Element, FormType, ElementAttributeType>>
  | undefined
> = ref(undefined);

const grid: Grid = gridModuleStore.grid as Grid;

function elementChanged(element: Element) {
  flowEditor.value?.process(element);
}

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

function createDefaultElement(
  type: ElementType,
  label: string,
  icon: string,
  inputs: ElementPin<ElementAttributeType>[] = [],
  outputs: ElementPin<ElementAttributeType>[] = [],
): MetaFlowElement<ElementType, ElementAttributeType> {
  return {
    type,
    label,
    icon,
    defaultElement: new Element(type, [], inputs, outputs),
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

const basicCategory: MetaFlowCategory<FormType, ElementAttributeType> = {
  label: 'Basic',
  icon: '',

  elements: [
    /*
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
    */
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

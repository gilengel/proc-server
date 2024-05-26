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

<script lang="ts"></script>
<script setup lang="ts">
import { ComputedRef, Ref, computed, ref } from 'vue';
import { MetaFlowCategory, MetaFlowCategoryElement } from 'src/components/flow';

import FlowEditor from 'src/components/flow/FlowEditor.vue';
import WidgetLayout from 'src/components/ui_builder/WidgetLayout.vue';

import { useGridModuleStore } from 'src/stores/gridModule';
import { useUndoRedoStore } from 'src/stores/undoredo';

import {
  Grid,
  Element,
  ElementAttributeType,
  FormType,
  FormInputOutput,
  ElementAttribute,
} from 'src/models/Grid';
import { ElementPin, FlowDirection } from 'src/components/flow/model';
import { ComponentExposed } from 'vue-component-type-helpers';

const gridModuleStore = useGridModuleStore();
const undoRedoStore = useUndoRedoStore();

const tab = ref('logic');

type FormElement = Element<FormType, ElementAttributeType>;

const flowEditor: Ref<
  | ComponentExposed<
      typeof FlowEditor<FormElement, FormType, ElementAttributeType>
    >
  | undefined
> = ref(undefined);

const grid: Grid<FormType, ElementAttributeType> = gridModuleStore.grid;

function elementChanged(element: FormElement) {
  flowEditor.value?.process(element);
}

const elements: ComputedRef<FormElement[]> = computed(() => {
  const els: FormElement[] = [];
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

function createDefaultPin<T extends string>(
  type: T,
  identifier: string,
): ElementPin<T> {
  return {
    type,
    identifier,
  };
}

function createElement<
  ElementType extends string,
  ElementAttributeType extends string,
>(
  type: ElementType,
  label: string,
  icon: string,
  attributes: ElementAttribute[],
  //inputs: ElementPin<ElementAttributeType>[],
  //outputs: ElementPin<ElementAttributeType>[],
): MetaFlowCategoryElement<ElementType, ElementAttributeType> {
  const inputs = attributes
    .filter(
      (attribute) =>
        attribute.direction !== undefined &&
        attribute.direction != FlowDirection.Out,
    )
    .map((attribute) => createDefaultPin(attribute.type, attribute.name));

  const outputs = attributes
    .filter(
      (attribute) =>
        attribute.direction !== undefined &&
        attribute.direction != FlowDirection.In,
    )
    .map((attribute) => createDefaultPin(attribute.type, attribute.name));
  return {
    label,
    icon,
    type,

    create: () => {
      return new Element(type, attributes, inputs, outputs);
    },
  };
}

const basicCategory: MetaFlowCategory<FormType, ElementAttributeType> = {
  label: 'Basic',
  icon: '',

  elements: [
    createElement(FormInputOutput.Input, 'Input', 'las la-download', [
      {
        type: ElementAttributeType.String,
        name: 'variable',
        value: 'muu',
      },
      {
        type: ElementAttributeType.String,
        name: 'value',
        value: '',
        direction: FlowDirection.Out,
      },
    ]),

    createElement(FormInputOutput.Output, 'Output', 'las la-upload', [
      {
        type: ElementAttributeType.String,
        name: 'value',
        value: '',
        direction: FlowDirection.In,
      },
    ]),

    createElement(FormInputOutput.Object, 'Object', 'las la-database', [
      {
        type: ElementAttributeType.String,
        name: 'value',
        value: '',
        direction: FlowDirection.InOut,
      },
    ]),
  ],
};
</script>

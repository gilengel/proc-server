<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="row">
    <div class="col-2">
      <ElementList
        :startDragging="(rowDraggingDisabled = true)"
        :stopDragging="(rowDraggingDisabled = false)"
      />
    </div>
    <div class="col-8">
      <Sortable
        :list="grid.rows"
        :itemKey="(e: Row) => e.id"
        handle=".drag-handle"
        class="dragArea list-group"
        @update="onUpdate($event)"
      >
        <template #item="{ element, index }">
          <transition appear name="list">
            <LayoutRow
              @selectElement="(e: Element) => onSelectedElementChanged(e)"
              dataKey="itemId"
              dataValue="Row"
              :model="element"
              :rowIndex="index"
              :key="index"
            />
          </transition>
        </template>
      </Sortable>

      <q-btn
        label="Add Row"
        style="margin-left: 5em"
        @click="
          gridModuleStore.addRow({
            id: uuid.v4(),
            columns: [{ width: 12, element: null, id: uuid.v4() }],
          })
        "
      />
    </div>
    <div class="col-2 options-container" ref="options_container">
      <component :is="element?.component" v-bind="element?.properties" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import * as uuid from 'uuid';
import { Sortable } from 'sortablejs-vue3';
import type { SortableEvent } from 'sortablejs';

import { useGridModuleStore } from 'src/stores/gridModule';
import { Grid, Element, Row } from 'src/models/Grid';

import LayoutRow from 'src/components/ui_builder/LayoutRow.vue';
import ElementList from 'src/components/ui_builder/ElementList.vue';
import { ModuleLoader } from './elementLoader';

export interface WidgetLayoutProps {
  grid: Grid;
}

defineProps<WidgetLayoutProps>();

const selectedElement: Ref<Element | undefined> = ref(undefined);

const gridModuleStore = useGridModuleStore();

const rowDraggingDisabled: Ref<boolean> = ref(false);

function onSelectedElementChanged(element: Element) {
  selectedElement.value = element;
}

function onUpdate(event: SortableEvent): void {
  if (!event.oldIndex || !event.newIndex) return;

  gridModuleStore.moveRow(event.oldIndex, event.newIndex);
}

const moduleLoader = await ModuleLoader.getInstance();

const element = computed(() => {
  if (!selectedElement.value) {
    return undefined;
  }

  const module = moduleLoader.getModule(selectedElement.value.type);

  return {
    properties: module.createDefaultProps(selectedElement.value),
    component: module.Options,
  };
});
</script>

<style scoped lang="scss">
$size: 24px;
.ghost {
  border-radius: 4px;

  color: $primary;

  overflow: collapse;
}

line {
  stroke: $accent;
  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  fill: $accent;
  stroke: $accent;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }
}
</style>

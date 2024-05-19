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
    <div class="col-2 options-container" ref="options_container"></div>
  </div>
</template>

<script setup lang="ts">
import * as uuid from 'uuid';
import { useGridModuleStore } from '../../stores/gridModule';

import { Sortable } from 'sortablejs-vue3';

import LayoutRow from 'components/ui_builder/LayoutRow.vue';
import ElementList from 'components/ui_builder/ElementList.vue';

import { Grid, Row } from '../../models/Grid';

import { Ref, ref } from 'vue';
import type { SortableEvent } from 'sortablejs';

export interface WidgetLayoutProps {
  grid: Grid;
}

defineProps<WidgetLayoutProps>();

const gridModuleStore = useGridModuleStore();

const rowDraggingDisabled: Ref<boolean> = ref(false);

function onUpdate(event: SortableEvent): void {
  if (!event.oldIndex || !event.newIndex) return;

  gridModuleStore.moveRow(event.oldIndex, event.newIndex);
}
</script>

<style scoped lang="scss">
$size: 24px;
.ghost {
  //border: solid 2px salmon;
  border-radius: 4px;

  color: $primary;
  //height: $size;

  overflow: collapse;
}

line {
  stroke: $accent;
  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  //fill: $accent;
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

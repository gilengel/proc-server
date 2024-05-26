<template>
  <div class="layout-row">
    <div class="actions">
      <q-btn
        class="drag-handle"
        dark
        flat
        round
        color="white"
        icon="las la-arrows-alt"
      />
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-trash-alt"
        @click="gridModuleStore.deleteRow(rowIndex)"
      />
    </div>
    <div class="row" ref="container">
      <LayoutColumn
        dataKey="itemId"
        @selectElement="(element) => $emit('selectElement', element)"
        @onElementChanged="(element) => $emit('onElementChanged', element)"
        :columnIndex="col_index"
        :rowIndex="rowIndex"
        :model="column"
        :class="colClass(col_index)"
        :splitDisabled="column.width <= 2"
        :editable="!isDraggingColumnSize"
        v-for="(column, col_index) in model.columns"
        :key="col_index"
      />

      <div
        class="splitter"
        :style="splitterStyleFn(i)"
        v-for="(n, i) in model.columns.length - 1"
        :key="i"
        @mousedown="dragMouseDown($event, i)"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { Ref, ref } from 'vue';

import LayoutColumn from './LayoutColumn.vue';
import { Row, Element } from 'src/models/Grid';
import { useGridModuleStore } from 'src/stores/gridModule';
import { columnValueValidator } from 'src/composables/useColumValidator';

const gridModuleStore = useGridModuleStore();

const container: Ref<HTMLElement | null> = ref(null);

const props = defineProps({
  minColSize: {
    type: Number,
    default: 2,
    required: false,
    validator: columnValueValidator,
  },

  maxColSize: {
    type: Number,
    default: 11,
    required: false,
    validator: columnValueValidator,
  },

  rowIndex: {
    type: Number,
    required: true,
    validator: (x: number) => x >= 0,
  },

  model: {
    type: Object as () => Row<T, S>,
    required: true,
  },
});

defineEmits<{
  selectElement: [element: Element<T, S>];

  onElementChanged: [element: Element<T, S>];
}>();

const flexColumns = 12;

const selectedSplitter: Ref<HTMLElement | undefined> = ref(undefined);
const selectedSplitterIndex: Ref<number> = ref(-1);

const isDraggingColumnSize: Ref<boolean> = ref(false);

const positions = {
  clientX: 0,
  clientY: 0,
  movementX: 0,
  movementY: 0,
};

function previousColSize(index: number): number {
  let result = 0;
  for (let i = 0; i < index; i++) {
    result += props.model.columns[i].width;
  }

  return result;
}

function colClass(i: number): string {
  const width = props.model.columns[i].width;
  return `col col-${width}`;
}

function splitterStyleFn(i: number): string {
  const left = (previousColSize(i + 1) / flexColumns) * 100;

  return `left: ${left}%`;
}

function dragMouseDown(event: MouseEvent, index: number) {
  event.preventDefault();

  // get the mouse cursor position at startup
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;

  // register handler on document level to capture mouse events that
  // do not occur on the vue element
  document.onmousemove = elementDrag;
  document.onmouseup = closeDragElement;

  selectedSplitter.value = event.target as HTMLElement;
  selectedSplitterIndex.value = index;

  isDraggingColumnSize.value = true;
}

function containerWidth(): number {
  return (container.value as HTMLElement).getBoundingClientRect().width;
}

function updatePositions(event: MouseEvent) {
  positions.movementX = positions.clientX - event.clientX;
  positions.movementY = positions.clientY - event.clientY;
  positions.clientX = event.clientX;
  positions.clientY = event.clientY;
}

function affectedColumnSizes(): { [key: string]: number } {
  const left = props.model.columns[selectedSplitterIndex.value].width;
  const right = props.model.columns[selectedSplitterIndex.value + 1].width;
  return {
    left: left,
    right: right,
    complete: left + right,
  };
}

function restrictNewColumnSizes(newColumnSize: number): {
  [key: string]: number;
} {
  const completeColumnSize = affectedColumnSizes().complete;

  if (newColumnSize < props.minColSize) {
    newColumnSize = props.minColSize;
  }

  if (newColumnSize > completeColumnSize - 1) {
    newColumnSize = completeColumnSize - 1;
  }

  if (newColumnSize > props.maxColSize) {
    newColumnSize = props.maxColSize;
  }

  let rightColumnSize = completeColumnSize - newColumnSize;
  if (rightColumnSize < props.minColSize) {
    const difference = props.minColSize - rightColumnSize;
    rightColumnSize = props.minColSize;
    newColumnSize -= difference;
  }

  if (rightColumnSize > props.maxColSize) {
    const difference = props.maxColSize - rightColumnSize;
    rightColumnSize = props.maxColSize;
    newColumnSize -= difference;
  }

  return {
    left: newColumnSize,
    right: rightColumnSize,
  };
}

function elementDrag(event: MouseEvent) {
  event.preventDefault();

  updatePositions(event);

  if (!container.value) {
    return;
  }

  const positionLeft = positions.clientX - container.value.offsetLeft;

  if (selectedSplitter.value) {
    const previousColSizes = previousColSize(selectedSplitterIndex.value);
    const flexSize =
      Math.ceil((positionLeft / containerWidth()) * flexColumns) -
      previousColSizes;

    const newColumnSizes = restrictNewColumnSizes(flexSize);

    const leftColumn = props.model.columns[selectedSplitterIndex.value];
    if (leftColumn.width === newColumnSizes.left) {
      return;
    }

    const rightColumn = props.model.columns[selectedSplitterIndex.value + 1];

    gridModuleStore.updateColumnsWidth(
      { column: leftColumn, width: newColumnSizes.left },
      { column: rightColumn, width: newColumnSizes.right },
    );
  }
}

function closeDragElement() {
  document.onmouseup = null;
  document.onmousemove = null;

  const previousColSizes =
    previousColSize(selectedSplitterIndex.value + 1) / flexColumns;
  const el = selectedSplitter;

  if (!el.value) {
    return;
  }

  el.value.style.left = `${previousColSizes * containerWidth()}px`;

  isDraggingColumnSize.value = false;
}
</script>

<style lang="scss" scoped>
.layout-row {
  width: 100%;
  display: flex;
  flex-direction: row;
  padding-left: 2em;
  padding-right: 2em;

  padding-top: 1em;
  padding-bottom: 1em;

  .actions {
    display: flex;
    flex-direction: column;
    visibility: hidden;
  }

  > .row {
    flex-grow: 2;
    border: solid 2px transparent;
  }
}

.layout-row:hover {
  > .actions {
    background: $primary;
    visibility: visible;
  }
  > .row {
    border: solid 2px $primary;
  }
}

.row {
  height: 100%;
  position: relative;

  .splitter {
    position: absolute;
    top: 0;
    width: 16px;
    height: 100%;

    cursor: ew-resize;
    transform: translateX(-50%);
  }
}
</style>

<template>
  <div class="layout-row" v-bind:class="{ active: !linkModeActive }">
    <div class="actions" v-if="!linkModeActive">
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
        @click="deleteRow(rowIndex)"
      />
    </div>
    <div class="row" ref="container">
      <LayoutColumn
        dataKey="itemId"
        :linkModeActive="linkModeActive"
        :columnIndex="col_index"
        :rowIndex="rowIndex"
        :model="column"
        :class="colClass(col_index)"
        :splitColumn="_splitColumn"
        :splitDisabled="column.width <= 2"
        :deleteColumn="_deleteColumn"
        v-for="(column, col_index) in model.columns"
      >
      </LayoutColumn>

      <div
        class="splitter"
        :style="splitterStyleFn(i)"
        v-for="(n, i) in model.columns.length - 1"
        @mousedown="dragMouseDown($event, i)"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action } from 'vuex-class';
import LayoutColumn from "./LayoutColumn.vue";

import { Row, Column } from "../../models/Grid";

@Component({
  name: "LayoutRow",

  components: {
    LayoutColumn,
  },
})
export default class LayoutRow extends Vue {

  @Action("deleteRow")
  deleteRow!: (rowIndex: number) => void;

  @Action("splitColumn")
  splitColumn!: (param: { row: Row, columnIndex: number }) => void;

  private _splitColumn(columnIndex: number) {
    this.splitColumn({ row: this.model, columnIndex: columnIndex })
  }

  @Action("deleteColumn")
  deleteColumn!: (param: { row: Row, columnIndex: number }) => void;

  private _deleteColumn(columnIndex: number) {
    this.deleteColumn({ row: this.model, columnIndex: columnIndex })
  }

  @Action("updateColumnWidth")
  updateColumnWidth!: (params: { column: Column, newWidth: number }) => void;
/*
  private _updateColumnWidth(width: number) {
    this.updateColumnWidth({ column: this.model, newWidth: width })
  }
*/

  // Minimal size for one column
  @Prop({
    default: 2,
    validator(x) {
      return x > 0 && x <= 12;
    },
  })
  minColSize!: number;

  // Maximal size for one column
  @Prop({
    default: 11,
    validator(x) {
      return x > 0 && x <= 12;
    },
  })
  maxColSize!: number;

  @Prop({
    validator(x) {
      return typeof x === "number" && x >= 0;
    },
  })
  rowIndex!: number;

  @Prop({
      validator(x) { return typeof x === "boolean" }
  })
  linkModeActive!: boolean;

  @Prop() model!: Row;

  // Individual column sized
  colSizes = new Array<number>();

  // Individual splitter positions
  splitterPositions = new Array<number>();

  flexColumns = 12;

  selectedSplitter: HTMLElement | null = null;
  selectedSplitterIndex: number = -1;

  positions = {
    clientX: 0,
    clientY: 0,
    movementX: 0,
    movementY: 0,
  };

  private splitDisabled(columnIndex: number) {
    return this.colSizes[columnIndex] < this.minColSize * 2;
  }

  previosColSize(index: number): number {
    let result = 0;
    for (let i = 0; i < index; i++) {
      result += this.model.columns[i].width;
    }

    return result;
  }

  colClass(i: number): string {
    const width = this.model.columns[i].width;
    return `col col-${width}`;
  }

  splitterStyleFn(i: number): string {
    const left = (this.previosColSize(i + 1) / this.flexColumns) * 100;

    return `left: ${left}%`;
  }

  mounted() {
    for (let column of this.model.columns) {
      column;
    }

    const numColumns = this.model.columns.length;
    for (let i = 0; i < numColumns - 1; i++) {
      this.splitterPositions.push(((i + 1) / numColumns) * 100);
    }
  }

  dragMouseDown(event: MouseEvent, index: number) {
    event.preventDefault();
    // get the mouse cursor position at startup:
    this.positions.clientX = event.clientX;
    this.positions.clientY = event.clientY;
    document.onmousemove = this.elementDrag;
    document.onmouseup = this.closeDragElement;

    this.selectedSplitter = event.target as HTMLElement;
    this.selectedSplitterIndex = index;
  }

  private containerWidth(): number {
    return (this.$refs.container as HTMLElement).getBoundingClientRect().width;
  }

  private updatePositions(event: MouseEvent) {
    this.positions.movementX = this.positions.clientX - event.clientX;
    this.positions.movementY = this.positions.clientY - event.clientY;
    this.positions.clientX = event.clientX;
    this.positions.clientY = event.clientY;
  }

  private calculateExpectedFlexSize(relativeLeft: number): number {
    const containerWidth = this.containerWidth();

    return Math.ceil((relativeLeft / containerWidth) * this.flexColumns);
  }

  private get affectedColumnSizes(): { [key: string]: number } {
    const left = this.model.columns[this.selectedSplitterIndex].width;
    const right = this.model.columns[this.selectedSplitterIndex + 1].width;
    return {
      left: left,
      right: right,
      complete: left + right,
    };
  }

  private restrictNewColumnSizes(
    newColumnSize: number
  ): { [key: string]: number } {
    const completeColumnSize = this.affectedColumnSizes.complete;

    if (newColumnSize < this.minColSize) {
      newColumnSize = this.minColSize;
    }

    if (newColumnSize > completeColumnSize - 1) {
      newColumnSize = completeColumnSize - 1;
    }

    if (newColumnSize > this.maxColSize) {
      newColumnSize = this.maxColSize;
    }

    let rightColumnSize = completeColumnSize - newColumnSize;
    if (rightColumnSize < this.minColSize) {
      const difference = this.minColSize - rightColumnSize;
      rightColumnSize = this.minColSize;
      newColumnSize -= difference;
    }

    if (rightColumnSize > this.maxColSize) {
      const difference = this.maxColSize - rightColumnSize;
      rightColumnSize = this.maxColSize;
      newColumnSize -= difference;
    }

    return {
      left: newColumnSize,
      right: rightColumnSize,
    };
  }

  elementDrag(event: MouseEvent) {
    event.preventDefault();

    this.updatePositions(event);
    const positionLeft =
      this.positions.clientX - this.$refs.container.offsetLeft;

    if (this.selectedSplitter) {
      const previousColSizes = this.previosColSize(this.selectedSplitterIndex);
      const flexSize =
        Math.ceil((positionLeft / this.containerWidth()) * this.flexColumns) -
        previousColSizes;

      const newColumnSizes = this.restrictNewColumnSizes(flexSize);
      this.updateColumnWidth({ column: this.model.columns[this.selectedSplitterIndex], newWidth: newColumnSizes.left })
      this.updateColumnWidth({ column: this.model.columns[this.selectedSplitterIndex+1], newWidth: newColumnSizes.right })
    }
  }

  closeDragElement() {
    console.log("=)=")
    document.onmouseup = null;
    document.onmousemove = null;

    const previousColSizes =
      this.previosColSize(this.selectedSplitterIndex + 1) / this.flexColumns;
    const el = this.selectedSplitter;

    if (el) {
      el.style.left = `${previousColSizes * this.containerWidth()}px`;
    }
  }
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

.active:hover {
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

    //background: rgba(salmon, 0.4);
    cursor: ew-resize;
    transform: translateX(-50%);
  }
}
</style>

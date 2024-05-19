import { Column, ElementType, Grid, Row } from './../models/Grid';
import { defineStore } from 'pinia';
import { GroupedUndoRedoAction, useUndoRedoStore } from './undoredo';
import { ref } from 'vue';
import * as uuid from 'uuid';
import { AddRow } from './actions/addRow';
import { DeleteColumn } from './actions/deleteColumn';
import { DeleteRow } from './actions/deleteRow';
import { MoveRow } from './actions/moveRow';
import { SplitColumn } from './actions/splitColumn';
import { UpdateColumnWidth } from './actions/updateColumn';
import { SetElement } from './actions/setElement';

const DefaultGrid: Grid = {
  id: uuid.v4(),

  rows: [
    {
      id: uuid.v4(),
      columns: [
        { width: 4, element: null, id: uuid.v4() },
        { width: 8, element: null, id: uuid.v4() },
      ],
    },

    {
      id: uuid.v4(),
      columns: [
        { width: 4, element: null, id: uuid.v4() },
        { width: 4, element: null, id: uuid.v4() },
        { width: 4, element: null, id: uuid.v4() },
      ],
    },

    {
      id: uuid.v4(),
      columns: [
        { width: 6, element: null, id: uuid.v4() },
        { width: 6, element: null, id: uuid.v4() },
      ],
    },
  ],
};

export const useGridModuleStore = defineStore('gridModule', () => {
  const grid = ref(DefaultGrid);
  const _undoRedoStore = useUndoRedoStore();

  function addRow(row: Row) {
    _undoRedoStore.execute(new AddRow(row, grid.value));
  }

  function deleteRow(rowIndex: number) {
    const row = grid.value?.rows[rowIndex];
    _undoRedoStore.execute(new DeleteRow(row, grid.value));
  }

  function deleteColumn(rowIndex: number, columnIndex: number) {
    const row = grid.value?.rows[rowIndex];

    _undoRedoStore.execute(new DeleteColumn(row, columnIndex, grid.value));
  }

  function splitColumn(rowIndex: number, columnIndex: number) {
    const row = grid.value?.rows[rowIndex];

    _undoRedoStore.execute(new SplitColumn(row, columnIndex, grid.value));
  }

  function moveRow(oldRowIndex: number, newRowIndex: number) {
    _undoRedoStore.execute(new MoveRow(oldRowIndex, newRowIndex, grid.value));
  }

  function setColumnElement(column: Column, type: ElementType) {
    _undoRedoStore.execute(new SetElement(column, type));
  }

  function updateColumnsWidth(
    left: { column: Column; width: number },
    right: { column: Column; width: number },
  ) {
    _undoRedoStore.execute(
      new GroupedUndoRedoAction([
        new UpdateColumnWidth(left.column, left.width),
        new UpdateColumnWidth(right.column, right.width),
      ]),
    );
  }

  return {
    grid,
    addRow,
    moveRow,
    deleteRow,
    deleteColumn,
    splitColumn,
    setColumnElement,
    updateColumnsWidth,
  };
});

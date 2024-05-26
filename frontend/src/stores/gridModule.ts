import { Column, Element, Grid, Row } from './../models/Grid';
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
import { UpdateElementAttribute } from './actions/updateElementAttribute';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DefaultGrid: Grid<any, any> = {
  id: uuid.v4(),

  rows: [
    {
      id: uuid.v4(),
      columns: [
        { width: 4, id: uuid.v4() },
        { width: 8, id: uuid.v4() },
      ],
    },

    {
      id: uuid.v4(),
      columns: [
        { width: 4, id: uuid.v4() },
        { width: 4, id: uuid.v4() },
        { width: 4, id: uuid.v4() },
      ],
    },

    {
      id: uuid.v4(),
      columns: [
        { width: 6, id: uuid.v4() },
        { width: 6, id: uuid.v4() },
      ],
    },
  ],
};

export const useGridModuleStore = <T extends string, S extends string>() =>
  defineStore('gridModule', () => {
    const grid = ref(DefaultGrid);
    const _undoRedoStore = useUndoRedoStore();

    function addRow(row: Row<T, S>) {
      _undoRedoStore.execute(new AddRow<T, S>(row, grid.value));
    }

    function deleteRow(rowIndex: number) {
      const row = grid.value?.rows[rowIndex];
      _undoRedoStore.execute(new DeleteRow<T, S>(row, grid.value));
    }

    function deleteColumn(rowIndex: number, columnIndex: number) {
      const row = grid.value?.rows[rowIndex];

      _undoRedoStore.execute(
        new DeleteColumn<T, S>(row, columnIndex, grid.value),
      );
    }

    function splitColumn(rowIndex: number, columnIndex: number) {
      const row = grid.value?.rows[rowIndex];

      _undoRedoStore.execute(new SplitColumn<T, S>(row, columnIndex));
    }

    function moveRow(oldRowIndex: number, newRowIndex: number) {
      _undoRedoStore.execute(
        new MoveRow<T, S>(oldRowIndex, newRowIndex, grid.value),
      );
    }

    function setColumnElement(column: Column<T, S>, type: T) {
      _undoRedoStore.execute(new SetElement<T, S>(column, type));
    }

    function updateElementAttribute(
      element: Element<T, S>,
      attribute: string,
      value: string | number | boolean,
    ) {
      _undoRedoStore.execute(
        new UpdateElementAttribute<T, S>(element, attribute, value),
      );
    }

    function updateColumnsWidth(
      left: { column: Column<T, S>; width: number },
      right: { column: Column<T, S>; width: number },
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
      updateElementAttribute,
    };
  })();

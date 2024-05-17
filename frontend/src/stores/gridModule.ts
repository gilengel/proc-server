import { Column, Grid, Row } from './../models/Grid';
import { defineStore } from 'pinia';
import {
  GroupedUndoRedoAction,
  UndoRedoAction,
  useUndoRedoStore,
} from './undoredo';
import { ref } from 'vue';
import * as uuid from 'uuid';

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

/**
 * Adds a row to he grid. This is a undo/redoable action
 */
class AddRow implements UndoRedoAction {
  constructor(
    private row: Row,
    private grid: Grid,
  ) {}

  undo(): void {
    const rowIndex = this.grid.rows.indexOf(this.row);
    this.grid.rows.splice(rowIndex, 1);
  }

  redo(): void {
    this.grid.rows.push(this.row);
  }
}

/**
 * Deletes a row to he grid. This is a undo/redoable action
 */
class DeleteRow implements UndoRedoAction {
  private rowIndex: number;
  constructor(
    private row: Row,
    private grid: Grid,
  ) {
    this.rowIndex = this.grid.rows.indexOf(this.row);
  }

  undo(): void {
    this.grid.rows.splice(this.rowIndex, 0, this.row);
  }

  redo(): void {
    this.grid.rows.splice(this.rowIndex, 1);
  }
}

/**
 * Updates the column width. This is a undo/redoable action
 */
class UpdateColumnWidth implements UndoRedoAction {
  private oldWidth: number;

  constructor(
    private column: Column,
    private newWidth: number,
  ) {
    this.oldWidth = column.width;
  }

  undo(): void {
    this.column.width = this.oldWidth;
  }

  redo(): void {
    this.column.width = this.newWidth;
  }
}

class SplitColumn implements UndoRedoAction {
  private addedColumn: Column | undefined;
  constructor(
    private row: Row,
    private columnIndex: number,
    private grid: Grid,
  ) {}

  undo(): void {
    const removedColumn = this.row.columns.splice(this.columnIndex - 2, 1);
    this.row.columns[this.columnIndex].width += removedColumn[0].width;
  }
  redo(): void {
    const colSize = this.row.columns[this.columnIndex].width / 2;

    const leftSize = Math.floor(colSize);
    const rightSize = Math.ceil(colSize);

    this.row.columns[this.columnIndex].width = leftSize;

    this.addedColumn = {
      id: uuid.v4(),
      width: rightSize,
      element: null,
    };

    this.row.columns.splice(this.columnIndex, 0, this.addedColumn);
  }
}

class DeleteColumn implements UndoRedoAction {
  private deletedColumn: Column | undefined;
  constructor(
    private row: Row,
    private columnIndex: number,
    private grid: Grid,
  ) {}

  undo(): void {
    if (!this.deletedColumn) {
      return;
    }

    this.row.columns[this.columnIndex].width -= this.deletedColumn.width;
    this.row.columns.splice(this.columnIndex, 0, this.deletedColumn);
  }
  redo(): void {
    const colSize = this.row.columns[this.columnIndex].width;

    const isLastColumn = this.columnIndex == this.row.columns.length - 1;

    this.deletedColumn = this.row.columns.splice(this.columnIndex, 1)[0];
    this.row.columns[
      isLastColumn ? this.columnIndex - 1 : this.columnIndex
    ].width += colSize;
  }
}

class MoveRow implements UndoRedoAction {
  constructor(
    private oldRowIndex: number,
    private newRowIndex: number,
    private grid: Grid,
  ) {}
  undo(): void {
    const tempRow = this.grid.rows[this.oldRowIndex];
    this.grid.rows[this.oldRowIndex] = this.grid.rows[this.newRowIndex];
    this.grid.rows[this.newRowIndex] = tempRow;
  }
  redo(): void {
    const tempRow = this.grid.rows[this.newRowIndex];
    this.grid.rows[this.newRowIndex] = this.grid.rows[this.oldRowIndex];
    this.grid.rows[this.oldRowIndex] = tempRow;
  }
}

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
    updateColumnsWidth,
  };
});

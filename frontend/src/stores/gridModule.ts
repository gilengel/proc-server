import { Column, Grid, Row } from './../models/Grid';
import { defineStore } from 'pinia';
import { reactive } from 'vue';

const DefaultGrid: Grid = {
  rows: [
    {
      columns: [
        { width: 4, element: null },
        { width: 8, element: null },
      ],
    },

    {
      columns: [
        { width: 4, element: null },
        { width: 4, element: null },
        { width: 4, element: null },
      ],
    },

    {
      columns: [
        { width: 6, element: null },
        { width: 6, element: null },
      ],
    },
  ],
};

export const useGridModuleStore = defineStore('page', {
  state: () =>
    reactive({
      _grid: DefaultGrid,
    }),

  getters: {
    grid(): Grid | undefined {
      return this._grid;
    },
  },

  actions: {
    addRow(row: Row) {
      this._grid?.rows.push(row);
    },

    deleteRow(rowIndex: number) {
      this._grid?.rows.splice(rowIndex, 1);
    },

    deleteColumn(rowIndex: number, columnIndex: number) {
      const row = this._grid?.rows[rowIndex];

      const colSize = row.columns[columnIndex].width;

      const isLastColumn = columnIndex == row.columns.length - 1;

      row.columns.splice(columnIndex, 1);
      row.columns[isLastColumn ? columnIndex - 1 : columnIndex].width +=
        colSize;
    },

    splitColumn(rowIndex: number, columnIndex: number) {
      const row = this._grid?.rows[rowIndex];

      const colSize = row.columns[columnIndex].width / 2;

      const leftSize = Math.floor(colSize);
      const rightSize = Math.ceil(colSize);

      row.columns[columnIndex].width = leftSize;

      row.columns.splice(columnIndex, 0, {
        width: rightSize,
        element: null,
      });
    },

    updateColumnWidth(param: { column: Column; newWidth: number }) {
      param.column.width = param.newWidth;
    },
  },
});

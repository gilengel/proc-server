import { Column, Row } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

import * as uuid from 'uuid';

export class SplitColumn<T extends string, S extends string>
  implements UndoRedoAction
{
  private addedColumn: Column<T, S> | undefined;
  constructor(
    private row: Row<T, S>,
    private columnIndex: number,
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
    };

    this.row.columns.splice(this.columnIndex, 0, this.addedColumn);
  }
}

import { Column, Row } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

export class DeleteColumn<T extends string, S extends string>
  implements UndoRedoAction
{
  private deletedColumn: Column<T, S> | undefined;
  constructor(
    private row: Row<T, S>,
    private columnIndex: number,
  ) {}

  undo(): void {
    this.row.columns[this.columnIndex].width -= this.deletedColumn!.width;
    this.row.columns.splice(this.columnIndex, 0, this.deletedColumn!);
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

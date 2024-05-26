import { Row, Grid } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

/**
 * Deletes a row to he grid. This is a undo/redoable action
 */
export class DeleteRow<T extends string, S extends string>
  implements UndoRedoAction
{
  private rowIndex: number;
  constructor(
    private row: Row<T, S>,
    private grid: Grid<T, S>,
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

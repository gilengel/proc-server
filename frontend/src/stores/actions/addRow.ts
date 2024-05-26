import { Grid, Row } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

/**
 * Adds a row to he grid. This is a undo/redoable action
 */
export class AddRow<T extends string, S extends string>
  implements UndoRedoAction
{
  constructor(
    private row: Row<T, S>,
    private grid: Grid<T, S>,
  ) {}

  undo(): void {
    const rowIndex = this.grid.rows.indexOf(this.row);
    this.grid.rows.splice(rowIndex, 1);
  }

  redo(): void {
    this.grid.rows.push(this.row);
  }
}

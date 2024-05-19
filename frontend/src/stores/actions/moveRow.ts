import { Grid } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

export class MoveRow implements UndoRedoAction {
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

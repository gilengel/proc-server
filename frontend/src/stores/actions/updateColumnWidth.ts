import { Column } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

/**
 * Updates the column width. This is a undo/redoable action
 */
export class UpdateColumnWidth<T extends string, S extends string>
  implements UndoRedoAction
{
  private oldWidth: number;

  constructor(
    private column: Column<T, S>,
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

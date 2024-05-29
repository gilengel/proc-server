import { Column, Element } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';
import { getModule } from 'src/components/ui_builder/elementLoader';

/**
 * Sets the element type of a column. If there was an element before it is cached
 * inside to allow the action to be unduable.
 *
 * This is a undo/redoable action
 */
export class SetElement<T extends string, S extends string>
  implements UndoRedoAction
{
  private oldElement: Element<T, S> | undefined;
  private newElement: Element<T, S> | undefined;
  constructor(
    private column: Column<T, S>,
    private elementType: T,
  ) {}

  undo(): void {
    if (!this.oldElement) {
      this.column.element = undefined;
      return;
    }

    this.column.element = this.oldElement;
  }

  redo(): void {
    if (this.column.element) {
      this.oldElement = this.column.element;
    }

    if (this.newElement) {
      this.column.element = this.newElement;
      return;
    }

    const module = getModule(this.elementType);

    this.newElement = module!.createDefaultElement();
    this.column.element = this.newElement;
  }
}

import { Column, ElementType, Element } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

import * as uuid from 'uuid';
import { ModuleLoader } from 'src/components/ui_builder/elementLoader';

async function createDefaultElement(type: ElementType, column: Column) {
  const element: Element = {
    uuid: uuid.v4(),
    type,
    attributes: [],
    column,
    classList: [],
  };

  const module = (await ModuleLoader.getInstance()).getModule(type);
  module.createDefaultAttributes(element);

  return element;
}
/**
 * Sets the element type of a column. If there was an element before it is cached
 * inside to allow the action to be unduable.
 *
 * This is a undo/redoable action
 */
export class SetElement implements UndoRedoAction {
  private oldElement: Element | undefined;
  private newElement: Element | undefined;
  constructor(
    private column: Column,
    private elementType: ElementType,
  ) {}

  undo(): void {
    if (!this.oldElement) {
      this.column.element = null;
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

    createDefaultElement(this.elementType, this.column).then((e) => {
      this.newElement = e;

      this.column.element = this.newElement;
    });
  }
}

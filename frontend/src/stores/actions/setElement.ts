import { Column, ElementType, Element } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';

import * as uuid from 'uuid';
import * as Text from 'src/components/ui_builder/text';
import * as Heading from 'src/components/ui_builder/heading';
import * as Image from 'src/components/ui_builder/image';

function createDefaultElement(type: ElementType, column: Column) {
  const element: Element = {
    uuid: uuid.v4(),
    type,
    attributes: [],
    column,
    classList: [],
  };

  switch (type) {
    case ElementType.Text: {
      Text.createDefaultAttributes(element);
      return element;
    }
    case ElementType.Heading: {
      Heading.createDefaultAttributes(element);
      return element;
    }
    case ElementType.Image: {
      Image.createDefaultAttributes(element);
      return element;
    }
    default: {
    }
  }

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

    this.newElement = createDefaultElement(this.elementType, this.column);

    this.column.element = this.newElement;
  }
}

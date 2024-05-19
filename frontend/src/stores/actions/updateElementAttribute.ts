//import { ElementAttribute } from 'src/models/Grid';
import { UndoRedoAction } from '../undoredo';
import { Element } from './../../models/Grid';

/**
 * Updates the column width. This is a undo/redoable action
 */
export class UpdateElementAttribute implements UndoRedoAction {
  private oldValue: string | number | boolean | undefined;

  constructor(
    private element: Element,
    private attribute: string,
    private value: string | number | boolean,
  ) {}

  private getAttribute() {
    return this.element.attributes.find(
      (attribute) => attribute.name === this.attribute,
    );
  }

  undo(): void {
    const attribute = this.getAttribute();
    if (!attribute || !this.oldValue) {
      return;
    }

    attribute.value = this.oldValue;
  }

  redo(): void {
    const attribute = this.getAttribute();

    if (!attribute) {
      return;
    }

    this.oldValue = attribute.value;
    attribute.value = this.value;
  }
}

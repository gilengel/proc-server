import { UndoRedoAction } from '../undoredo';
import { Element } from './../../models/Grid';

/**
 * Updates an attribute of the element. This is an undoable/redoable action
 */
export class UpdateElementAttribute<T extends string, S extends string>
  implements UndoRedoAction
{
  private oldValue: string | number | boolean | undefined;

  constructor(
    private element: Element<T, S>,
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

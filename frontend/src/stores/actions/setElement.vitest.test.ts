import { SetElement } from './setElement';
import { expect, describe, it, beforeAll } from 'vitest';

import { Column, ElementAttributeType, ElementType } from 'src/models/Grid';
import { loadAllModules } from 'src/components/ui_builder/elementLoader';

describe('setElement', () => {
  beforeAll(async () => {
    await loadAllModules<ElementType, ElementAttributeType>();
  });

  it('should create a default element on redo', async () => {
    const column: Column<ElementType, ElementAttributeType> = {
      id: '',
      width: 0,
    };

    const setElement = new SetElement(column, ElementType.Text);
    setElement.redo();

    expect(column.element).not.toBeUndefined();
  });

  it('should remove the element on undo', async () => {
    const column: Column<ElementType, ElementAttributeType> = {
      id: '',
      width: 0,
    };

    const setElement = new SetElement(column, ElementType.Text);
    setElement.redo();

    expect(column.element).not.toBeUndefined();
    setElement.undo();
    expect(column.element).toBeUndefined();
  });

  it('should overwrite any previous element if existing', async () => {
    const column: Column<ElementType, ElementAttributeType> = {
      id: '',
      width: 0,
    };

    const setElement = new SetElement(column, ElementType.Text);
    setElement.redo();

    expect(column.element).not.toBeUndefined();

    const setElementOverwriting = new SetElement(column, ElementType.Button);
    setElementOverwriting.redo();
    expect(column.element?.type).toBe(ElementType.Button);
  });

  it('should restore any overwritten element on undo', async () => {
    const column: Column<ElementType, ElementAttributeType> = {
      id: '',
      width: 0,
    };

    const setElement = new SetElement(column, ElementType.Text);
    setElement.redo();

    expect(column.element).not.toBeUndefined();

    const setElementOverwriting = new SetElement(column, ElementType.Button);
    setElementOverwriting.redo();
    expect(column.element?.type).toBe(ElementType.Button);
    setElementOverwriting.undo();
    expect(column.element?.type).toBe(ElementType.Text);
  });

  it('should set the element to a previously overwritten on if existing', async () => {
    const column: Column<ElementType, ElementAttributeType> = {
      id: '',
      width: 0,
    };

    const setElement = new SetElement(column, ElementType.Text);
    setElement.redo();

    expect(column.element).not.toBeUndefined();

    const setElementOverwriting = new SetElement(column, ElementType.Button);
    setElementOverwriting.redo();
    expect(column.element?.type).toBe(ElementType.Button);
    setElementOverwriting.undo();
    expect(column.element?.type).toBe(ElementType.Text);
    setElementOverwriting.redo();
    expect(column.element?.type).toBe(ElementType.Button);
  });
});

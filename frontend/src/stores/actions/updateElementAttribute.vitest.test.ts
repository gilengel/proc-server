import { loadAllModules } from 'src/components/ui_builder/elementLoader';
await loadAllModules();

import { UpdateElementAttribute } from './updateElementAttribute';
import { expect, describe, it } from 'vitest';

import { Element, ElementAttributeType, ElementType } from 'src/models/Grid';

const createTestElement = () => {
  return new Element(ElementType.Text, [
    {
      name: 'test',
      type: ElementAttributeType.String,
      value: 'test_value',
    },
  ]);
};

describe('updateElementAttribute', () => {
  it('should set the columns width on redo', async () => {
    const element = createTestElement();

    const splitColumn = new UpdateElementAttribute(
      element,
      'test',
      'new_value',
    );
    splitColumn.redo();

    expect(element.attributes.find((e) => e.name === 'test')?.value).toBe(
      'new_value',
    );
  });

  it('should set the columns with to its original value on undo', async () => {
    const element = createTestElement();

    const splitColumn = new UpdateElementAttribute(
      element,
      'test',
      'new_value',
    );
    splitColumn.redo();

    expect(element.attributes.find((e) => e.name === 'test')?.value).toBe(
      'new_value',
    );
    splitColumn.undo();
    expect(element.attributes.find((e) => e.name === 'test')?.value).toBe(
      'test_value',
    );
  });
});

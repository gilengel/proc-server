import { DeleteColumn } from './deleteColumn';
import { ElementType, ElementAttributeType, Row } from 'src/models/Grid';
import { expect, describe, it } from 'vitest';
import { SplitColumn } from './splitColumn';

const createTestRow = (): Row<ElementType, ElementAttributeType> => {
  return {
    id: '',
    columns: [
      {
        id: '0',
        width: 6,
      },
      {
        id: '1',
        width: 6,
      },
    ],
  };
};

describe('splitColumn', () => {
  it('should split a column in two on redo', async () => {
    const row = createTestRow();
    const splitColumn = new SplitColumn(row, 0);
    splitColumn.redo();

    expect(row.columns.length).toBe(3);
  });

  it('should remove the added column on undo', async () => {
    const row = createTestRow();
    const splitColumn = new SplitColumn(row, 0);
    splitColumn.redo();

    expect(row.columns.length).toBe(3);
    splitColumn.undo();
    expect(row.columns.length).toBe(2);
  });
});

import { ElementType, ElementAttributeType, Row } from 'src/models/Grid';
import { expect, describe, it } from 'vitest';
import { AddRow } from './addRow';
import { createTestGrid } from './test.helper';

const row: Row<ElementType, ElementAttributeType> = {
  id: '',
  columns: [],
};

describe('addRow', () => {
  it('should add a row to the grid on redo', async () => {
    const grid = createTestGrid();
    const addRow = new AddRow(row, grid);
    addRow.redo();

    expect(grid.rows.length).toBe(1);
  });

  it('should remove the row from the grid on undo', async () => {
    const grid = createTestGrid();

    const addRow = new AddRow(row, grid);
    addRow.redo();

    expect(grid.rows.length).toBe(1);

    addRow.undo();
    expect(grid.rows.length).toBe(0);
  });
});

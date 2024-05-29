import { MoveRow } from './moveRow';
import { expect, describe, it } from 'vitest';
import { ElementAttributeType, ElementType, Grid } from 'src/models/Grid';

const createTestGrid = (): Grid<ElementType, ElementAttributeType> => {
  return {
    id: '',
    rows: [
      {
        id: '0',
        columns: [],
      },
      { id: '1', columns: [] },
    ],
  };
};

describe('moveRow', () => {
  it('should delete a column on redo on the grid', async () => {
    const grid = createTestGrid();
    const moveRow = new MoveRow(0, 1, grid);
    moveRow.redo();

    expect(grid.rows[0].id).toBe('1');
    expect(grid.rows[1].id).toBe('0');
  });

  it('should delete a column on redo on the grid', async () => {
    const grid = createTestGrid();
    const moveRow = new MoveRow(0, 1, grid);
    moveRow.redo();

    expect(grid.rows[0].id).toBe('1');
    expect(grid.rows[1].id).toBe('0');

    moveRow.undo();

    expect(grid.rows[0].id).toBe('0');
    expect(grid.rows[1].id).toBe('1');
  });
});

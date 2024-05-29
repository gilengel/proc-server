import { Grid, ElementType, ElementAttributeType } from 'src/models/Grid';

export const createTestGrid = (): Grid<ElementType, ElementAttributeType> => {
  return {
    id: '',
    rows: [],
  };
};

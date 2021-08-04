import { expect, test, describe } from '@jest/globals';

import { getters } from '../getters';
import { PageState } from '../state';
import { Page, NewPage } from '../../../models/Page';

describe('Page', () => {
  test('persistedPages returns all persistedPages', () => {
    const state: PageState = {
      _persistedPages: [
        {
          page_pk: 0,
          page_id: 'id',
          name: 'random page',
          created_at: 'some date...',
        },
      ],
      _newPages: [],
    };

    const { persistedPages } = getters;
    const result = persistedPages(state, {}, {}, {}) as Array<Page>;

    expect(result.length).toBe(1);
    expect(result[0].page_pk).toBe(0);
    expect(result[0].page_id).toBe('id');
    expect(result[0].name).toBe('random page');
    expect(result[0].created_at).toBe('some date...');
  });

  test('newPages returns all intermediate cached pages', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id',
          name: 'random page',
          created_at: 'some date...',
        },
        {
          page_id: 'id 2',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    const { newPages } = getters;
    const result = newPages(state, {}, {}, {}) as Array<NewPage>;

    expect(result.length).toBe(2);

    expect(result[0].page_id).toBe('id');
    expect(result[0].name).toBe('random page');
    expect(result[0].created_at).toBe('some date...');

    expect(result[1].page_id).toBe('id 2');
    expect(result[1].name).toBe('random page 2');
    expect(result[1].created_at).toBe('some date...');
  });

  test('persistedPageById returns persisted page by id', () => {
    const state: PageState = {
      _persistedPages: [
        {
          page_pk: 0,
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
        {
          page_pk: 1,
          page_id: 'id 2',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
      _newPages: [],
    };

    const { persistedPageById } = getters;
    const result = (
      persistedPageById(state, {}, {}, {}) as (
        page_id: string
      ) => NewPage | undefined
    )('id 2');
    expect(result);

    if (result) {
      expect(result.page_id).toBe('id 2');
      expect(result.name).toBe('random page 2');
      expect(result.created_at).toBe('some date...');
    }
  });

  test('newPageById returns intermediate cached page by id', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id',
          name: 'random page',
          created_at: 'some date...',
        },
        {
          page_id: 'id 2',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    const { newPageById } = getters;
    const result = (
      newPageById(state, {}, {}, {}) as (page_id: string) => NewPage | undefined
    )('id 2');
    expect(result);

    if (result) {
      expect(result.page_id).toBe('id 2');
      expect(result.name).toBe('random page 2');
      expect(result.created_at).toBe('some date...');
    }
  });
});

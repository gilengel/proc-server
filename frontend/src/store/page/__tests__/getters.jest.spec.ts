
import { expect, jest, test, describe, beforeAll, afterAll } from '@jest/globals';

import { getters }  from '../getters'
import state, { PageStateInterface } from '../state';
import { Page, NewPage } from '../../../models/Page'

describe('Page', () => {
  test('persistedPages returns all persistedPages', () => {
    const state : PageStateInterface = {
      _persistedPages: [{
        page_pk: 0,
        page_id: 'id',
        name: 'random page',
        created_at: 'some date...'
      }],
      _newPages: []
    }

    const { persistedPages } = getters
    const result = persistedPages(state);

    expect().toBe(1)

  });

  test('_storeNewPage adds page to intermediate array', () => {
    const state : PageStateInterface = {
      _persistedPages: [],
      _newPages: []
    }

    const { _storeNewPage } = mutations
    _storeNewPage(state, [{}])

    expect(state._newPages.length).toBe(1)

  });
});

import { expect, jest, test, describe, beforeAll, afterAll } from '@jest/globals';

import mutations  from '../mutations'
import state, { PageStateInterface } from '../state';
import { Page, NewPage } from '../../../models/Page'

describe('Page', () => {
  test('_addPersistedPages adds page to persisted array', () => {
    const state : PageStateInterface = {
      _persistedPages: [],
      _newPages: []
    }

    const { _addPersistedPages } = mutations
    _addPersistedPages(state, [{}])

    expect(state._persistedPages.length).toBe(1)

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
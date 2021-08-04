import { expect, test, describe } from '@jest/globals';

import mutations from '../mutations';
import { PageState } from '../state';

describe('Page', () => {
  test('_addPersistedPages adds page to persisted array', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [],
    };

    mutations.ADD_PERSISTED_PAGES(state, [{
      page_pk: 0,
      page_id: '',
      name: '',
      created_at: '',
    }]);

    expect(state._persistedPages.length).toBe(1);
  });

  test('_storeNewPage adds page to intermediate array', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [],
    };

    mutations.STORE_NEW_PAGE(state, {page_id: '', name: '', created_at: ''});

    expect(state._newPages.length).toBe(1);
  });

  test('_updatePage replaces all stored values with new ones', () => {
    const state: PageState = {
      _persistedPages: [
        {
          page_pk: 0,
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
      _newPages: [],
    };

    mutations.UPDATE_PAGE(state, {
      page_pk: 0,
      page_id: 'id 3',
      name: 'new name',
      created_at: 'new date',
    });

    expect(state._persistedPages[0].page_id).toBe('id 3');
    expect(state._persistedPages[0].name).toBe('new name');
    expect(state._persistedPages[0].created_at).toBe('new date');
  });

  test('_updatePage does nothing if page not exist', () => {
    const state: PageState = {
      _persistedPages: [
        {
          page_pk: 0,
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
      _newPages: [],
    };

    mutations.UPDATE_PAGE(state, {
      page_pk: 1,
      page_id: 'id 3',
      name: 'new name',
      created_at: 'new date',
    });

    expect(state._persistedPages[0].page_id).toBe('id 1');
    expect(state._persistedPages[0].name).toBe('random page 2');
    expect(state._persistedPages[0].created_at).toBe('some date...');
  });

  test('_updateNewPage replaces all stored values with new ones', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    mutations.UPDATE_NEW_PAGE(state, {
      page: state._newPages[0],
      update: {
        name: 'new name',
        created_at: 'new date',
      },
    });

    expect(state._newPages[0].name).toBe('new name');
    expect(state._newPages[0].created_at).toBe('new date');
  });

  test('_updateNewPage replaces only name if created_at not provided', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    mutations.UPDATE_NEW_PAGE(state, {
      page: state._newPages[0],
      update: {
        name: 'new name',
      },
    });

    expect(state._newPages[0].name).toBe('new name');
    expect(state._newPages[0].created_at).toBe('some date...');
  });

  test('_updateNewPage replaces only created_at if name not provided', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    mutations.UPDATE_NEW_PAGE(state, {
      page: state._newPages[0],
      update: {
        created_at: 'new date',
      },
    });

    expect(state._newPages[0].name).toBe('random page 2');
    expect(state._newPages[0].created_at).toBe('new date');
  });

  test('_updateNewPage does nothing if to be updated page is not found', () => {
    const state: PageState = {
      _persistedPages: [],
      _newPages: [
        {
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
    };

    mutations.UPDATE_NEW_PAGE(state, {
      page: {
        page_id: 'NOT_EXISTING_PAGE_ID',
        name: 'NOT_EXISTING_PAGE_NAME',
        created_at: 'NOT_EXISTING_PAGE_CREATED_AT',
      },
      update: {
        name: 'new name',
        created_at: 'new date',
      },
    });

    expect(state._newPages[0].page_id).toBe('id 1');
    expect(state._newPages[0].name).toBe('random page 2');
    expect(state._newPages[0].created_at).toBe('some date...');
  });

  test('_deletePersistedPageById deletes a persited page', () => {
    const state: PageState = {
      _persistedPages: [
        {
          page_pk: 0,
          page_id: 'id 1',
          name: 'random page 2',
          created_at: 'some date...',
        },
      ],
      _newPages: [],
    };

    mutations.DELETE_PERSISTED_PAGE_BY_ID(state, 'id 1');

    expect(state._persistedPages.length).toBe(0);
  });
});

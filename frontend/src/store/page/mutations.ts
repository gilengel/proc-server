import { MutationTree } from 'vuex';
import { PageState } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page';

export enum PageMutationTypes {
  ADD_PERSISTED_PAGES = 'ADD_PERSISTED_PAGES',
  UPDATE_PAGE = 'UPDATE_PAGE',
  UPDATE_NEW_PAGE = 'UPDATE_NEW_PAGE',
  STORE_NEW_PAGE = 'STORE_NEW_PAGE',
  DELETE_PERSISTED_PAGE_BY_ID = 'DELETE_PERSISTED_PAGE_BY_ID',
}

export type Mutations<S = PageState> = {
  [PageMutationTypes.ADD_PERSISTED_PAGES](state: S, pages: Page[]): void
  [PageMutationTypes.UPDATE_PAGE](state: S, updatedPage: Page): void
  [PageMutationTypes.UPDATE_NEW_PAGE](state: S, params: { page: NewPage; update: UpdateNewPage }): void
  [PageMutationTypes.STORE_NEW_PAGE](state: S, newPage: NewPage): void
  [PageMutationTypes.DELETE_PERSISTED_PAGE_BY_ID](state: S, pageId: string): void
}

const mutation: MutationTree<PageState> & Mutations = {
  /**
   * Adds already persisted pages to the intermediate memory of the store
   *
   * @param stage
   */
   [PageMutationTypes.ADD_PERSISTED_PAGES](state, pages: Page[]) {
    for (const page of pages) {
      state._persistedPages.push(page);
    }
  },

  /**
   * Updates an existing page on backend side and in local store
   * @param updatedPage
   */
   [PageMutationTypes.UPDATE_PAGE](state, updatedPage: Page) {
    const found = state._persistedPages.find(
      (page: Page) => page.page_pk === updatedPage.page_pk
    );

    if (found) {
      found.page_pk = updatedPage.page_pk;
      found.page_id = updatedPage.page_id;
      found.name = updatedPage.name;
      found.created_at = updatedPage.created_at;
      //found = Object.assign({}, found, updatedPage);
    }
  },

  /**
   * Updates a new page on local store
   * @param updatedNewPage
   */
   [PageMutationTypes.UPDATE_NEW_PAGE](state, params: { page: NewPage; update: UpdateNewPage }) {
    const foundIndex = state._newPages.findIndex(
      (page: NewPage) => page.page_id === params.page.page_id
    );

    if (foundIndex === -1) {
      return;
    }

    if (params.update.name) {
      state._newPages[foundIndex].name = params.update.name;
    }

    if (params.update.created_at) {
      state._newPages[foundIndex].created_at = params.update.created_at;
    }
  },

  /**
   * Stores the new page in the local store
   * @param newPage
   */
   [PageMutationTypes.STORE_NEW_PAGE](state, newPage: NewPage) {
    state._newPages.push(newPage);
  },

  [PageMutationTypes.DELETE_PERSISTED_PAGE_BY_ID](state, pageId: string) {
    state._persistedPages.splice(
      state._persistedPages.findIndex((p) => p.page_id === pageId),
      1
    );
  },
};

export default mutation;

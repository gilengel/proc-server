import { MutationTree } from 'vuex';
import { PageStateInterface } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page';
import { PAGES_URL, UpdateOne } from 'src/models/Backend';

const mutation: MutationTree<PageStateInterface> = {
  /**
   * Adds already persisted pages to the intermediate memory of the store
   *
   * @param stage
   */
  _addPersistedPages(state, pages: Page[]) {
    for(const page of pages) {
      state._persistedPages.push(page)
    }
  },

  /**
   * Updates an existing page on backend side and in local store
   * @param updatedPage
   */
  _updatePage(state, updatedPage: Page) {
    // Persist the page on backend
    UpdateOne<Page>(`${PAGES_URL}/${updatedPage.page_id}`, updatedPage)
      .then(() => {
        // Update the page in the client store
        let found = state._persistedPages.find(
          (page: Page) => page.page_pk === updatedPage.page_pk
        );

        if (found) {
          found = Object.assign({}, found, updatedPage);
        }
      })
      .catch((er) => console.error(er));
  },

  /**
   * Updates a new page on local store
   * @param updatedNewPage
   */
  _updateNewPage(state, params: { page: NewPage; update: UpdateNewPage }) {
    const foundIndex = state._newPages.findIndex(
      (page: NewPage) => page.page_id === params.page.page_id
    );

    if (foundIndex === -1) {
      return;
    }

    if (params.update.name) {
      state._newPages[foundIndex].name = params.update.name;
    }
  },

  /**
   * Stores the new page in the local store
   * @param newPage
   */
  _storeNewPage(state, newPage: NewPage) {
    state._newPages.push(newPage);
  },

  _deletePersistedPageById(state, pageId: string) {
    state._persistedPages.splice(state._persistedPages.findIndex((p) => p.page_id === pageId), 1)
  }
};

export default mutation;
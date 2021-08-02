import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { PageStateInterface } from './state';
import { Page, NewPage } from 'src/models/Page';

export const getters: GetterTree<PageStateInterface, StateInterface> = {
  /**
   * Returns all pages that are persisted in the backend and requested by the client.
   * Be aware that this list does necessarily contain all of the pages from backend
   * side.
   *
   * @readonly
   * @type {Array<Page>}
   * @memberof PageStore
   */
  persistedPages(state): Array<Page> {
    return state._persistedPages;
  },

  /**
   * Returns all pages that were created on client side and not persisted on
   * backend side
   *
   * @readonly
   * @type {Array<NewPage>}
   * @memberof PageStore
   */
  newPages(state): Array<NewPage> {
    return state._newPages;
  },

  /**
   * Returns a persisted page by its id.
   *
   * @param page_id The uuid of the page
   * @returns Page if page is found, undefined if not
   */
  persistedPageById(state) {
    return (page_id: string): Page | undefined => {
      return state._persistedPages.find(
        (page: Page) => page.page_id === page_id
      );
    };
  },

  /**
   * Returns a not yet persisted page by its id.
   *
   * @param page_id The uuid of the new page
   * @returns Page if page is found, undefined if not
   */
  newPageById(state) {
    return (page_id: string): NewPage | undefined => {
      return state._newPages.find((page: NewPage) => page.page_id === page_id);
    };
  },
};

export default getters;

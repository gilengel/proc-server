import { defineStore } from 'pinia';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page';
import {
  PAGES_URL,
  PostOne,
  DeleteOne,
  GetMultiple,
  UpdateOne,
} from 'src/models/Backend';
import { reactive } from 'vue';

export const usePageStore = defineStore('page', {
  state: () =>
    reactive({
      _persistedPages: [] as Page[],
      _newPages: [] as NewPage[],
    }),

  getters: {
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
        return state._newPages.find(
          (page: NewPage) => page.page_id === page_id
        );
      };
    },
  },

  actions: {
    /**
     * Fetches all stored pages from the backend.
     *
     * Be aware that the result can be big and avoid to call it to often
     * to prevent slowing down the application
     * @param stage
     */
    async fetchAllFromBackend(): Promise<Page[]> {
      return new Promise((resolve, reject) => {
        GetMultiple<Page>(`${PAGES_URL}`)
          .then((fetchedBackendPages) => {
            for (const page of fetchedBackendPages) {
              this._persistedPages.push(page);
            }

            resolve(fetchedBackendPages);
          })
          .catch((err) => reject(err));
      });
    },

    /**
     * Updates an already stored page in the store and in the backend.
     * @param page
     */
    async updatePage(page: Page): Promise<boolean> {
      return new Promise((resolve, reject) => {
        // Persist the page on backend
        UpdateOne<Page>(`${PAGES_URL}/${page.page_id}`, page)
          .then(() => {
            const found = this._persistedPages.find(
              (page: Page) => page.page_pk === page.page_pk
            );
        
            if (found) {
              found.page_pk = page.page_pk;
              found.page_id = page.page_id;
              found.name = page.name;
              found.created_at = page.created_at;
              //found = Object.assign({}, found, updatedPage);
            }

            resolve(true);
          })
          .catch((er) => reject(er));
      });
    },

    /**
     * Updates an already stored new page in the store.
     * @param page
     */
    updateNewPage(params: { page: NewPage; update: UpdateNewPage }) {
      const foundIndex = this._newPages.findIndex(
        (page: NewPage) => page.page_id === params.page.page_id
      );
  
      if (foundIndex === -1) {
        return;
      }
  
      if (params.update.name) {
        this._newPages[foundIndex].name = params.update.name;
      }
  
      if (params.update.created_at) {
        this._newPages[foundIndex].created_at = params.update.created_at;
      }
    },

    /**
     * Adds a new page to the local store.
     * Be aware that the page is not persisted to backend. For this see @see persistNewPage.
     * @param newPage The page to be saved
     */
    storeNewPage(page: NewPage) {
      this._newPages.push(page);
      //commit(PageMutationTypes.STORE_NEW_PAGE, page);
    },

    /**
     * Persists a new page to the backend and adding the result to the local store.
     * In case you only want to store it to the local store withtout backend persistance @see storeNewPage.
     * @param newPage The page to be saved
     */
    async persistNewPage(page: NewPage): Promise<Page> {
      return new Promise((resolve, reject) => {
        PostOne<NewPage, Page>(`${PAGES_URL}`, page)
          .then((page: Page) => {
            this._persistedPages.push(page);
            //commit(PageMutationTypes.ADD_PERSISTED_PAGES, [page]);
            resolve(page);
          })
          .catch((e) => reject(e));
      });
    },

    deletePageById(pageId: string) {
      return new Promise<boolean>((resolve, reject) => {
        DeleteOne(`${PAGES_URL}`, pageId)
          .then(() => {
            const index = this._persistedPages.findIndex(
              (page) => page.page_id === pageId
            );

            if (index === -1) {
              resolve(false);
              return;
            }

            this._persistedPages.splice(index, 1);
            resolve(true);
          })
          .catch((e) => reject(e));
      });
    },
  },
});

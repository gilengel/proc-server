import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PageState } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page';
import { Mutations, PageMutationTypes } from './mutations';
import {
  PAGES_URL,
  PostOne,
  DeleteOne,
  GetMultiple,
  UpdateOne,
} from 'src/models/Backend';

type PageActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1],
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<PageState, StateInterface>, 'commit'>

export interface Actions {
  fetchAllFromBackend({ commit }: PageActionContext): Promise<Page[]>
  updatePage({ commit }: PageActionContext, page: Page): Promise<boolean>
  updateNewPage({ commit }: PageActionContext, params: { page: NewPage; update: UpdateNewPage }) : void
  storeNewPage({ commit }: PageActionContext, page: NewPage) : void
  persistNewPage({ commit }: PageActionContext, page: NewPage): Promise<Page>
  deletePageById({ commit }: PageActionContext, pageId: string) : Promise<boolean>    
}

const actions: ActionTree<PageState, StateInterface> & Actions = {
  /**
   * Fetches all stored pages from the backend.
   *
   * Be aware that the result can be big and avoid to call it to often
   * to prevent slowing down the application
   * @param stage
   */
  async fetchAllFromBackend({ commit }): Promise<Page[]> {
    return new Promise((resolve, reject) => {
      GetMultiple<Page>(`${PAGES_URL}`)
      .then((result) => {        
        commit(PageMutationTypes.ADD_PERSISTED_PAGES, result);

        resolve(result)
      })
      .catch((err) => reject(err));
    })

  },

  /**
   * Updates an already stored page in the store and in the backend.
   * @param page
   */
  async updatePage({ commit }, page: Page): Promise<boolean> {
    return new Promise((resolve, reject) => {
    // Persist the page on backend
    UpdateOne<Page>(`${PAGES_URL}/${page.page_id}`, page)
      .then(() => { commit(PageMutationTypes.UPDATE_PAGE, page); resolve(true); })
      .catch((er) => reject(er));
      })
  },

  /**
   * Updates an already stored new page in the store.
   * @param page
   */
  updateNewPage({ commit }, params: { page: NewPage; update: UpdateNewPage }) {
    commit(PageMutationTypes.UPDATE_NEW_PAGE, params);
  },

  /**
   * Adds a new page to the local store.
   * Be aware that the page is not persisted to backend. For this see @see persistNewPage.
   * @param newPage The page to be saved
   */
  storeNewPage({ commit }, page: NewPage) {
    commit(PageMutationTypes.STORE_NEW_PAGE, page);
  },

  /**
   * Persists a new page to the backend and adding the result to the local store.
   * In case you only want to store it to the local store withtout backend persistance @see storeNewPage.
   * @param newPage The page to be saved
   */
  async persistNewPage({ commit }, page: NewPage) : Promise<Page> {
    return new Promise((resolve, reject) => {
      PostOne<NewPage, Page>(`${PAGES_URL}`, page).then((page: Page) => {
        commit(PageMutationTypes.ADD_PERSISTED_PAGES, [page]);
        resolve(page)
      }).catch((e) => reject(e))
    })
  },

  deletePageById({ commit }, pageId: string) {
    return new Promise<boolean>((resolve, reject) => {
      DeleteOne(`${PAGES_URL}`, pageId)
        .then(() => { commit(PageMutationTypes.DELETE_PERSISTED_PAGE_BY_ID, pageId); resolve(true) })
        .catch((e) => reject(e))
    })
  },
};

export default actions;

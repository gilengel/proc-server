import { ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PageStateInterface } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page'
import { PAGES_URL, PostOne, DeleteOne, GetMultiple } from 'src/models/Backend';

const actions: ActionTree<PageStateInterface, StateInterface> = {
  /**
   * Fetches all stored pages from the backend.
   *
   * Be aware that the result can be big and avoid to call it to often
   * to prevent slowing down the application
   * @param stage
   */
  fetchAllFromBackend() {
    GetMultiple<Page>(`${PAGES_URL}`)
      .then((result) => {
        
        this.commit('Page/_addPersistedPages', result)
      })
      .catch((err) => console.error(err));

  },

  /**
   * Updates an already stored page in the store and in the backend.
   * @param page
   */
   updatePage(stage, page: Page) {
     this.commit('_updatePage', page)
   },

   /**
    * Updates an already stored new page in the store.
    * @param page
    */
   updateNewPage(stage, params: { page: NewPage, update: UpdateNewPage }) {
     this.commit('_updateNewPage', params)
   },

  /**
  * Adds a new page to the local store.
  * Be aware that the page is not persisted to backend. For this see @see persistNewPage.
  * @param newPage The page to be saved
  */
   storeNewPage(stage, page: NewPage) {
     this.commit('Page/_storeNewPage', page)
   },

   /**
   * Persists a new page to the backend and adding the result to the local store.
   * In case you only want to store it to the local store withtout backend persistance @see storeNewPage.
   * @param newPage The page to be saved
   */
   async persistNewPage(stage, page: NewPage) {
    await PostOne<NewPage, Page>(`${PAGES_URL}`, page).then((page: Page) => {      
      this.commit('Page/_persistNewPage', page)
    });
     
   },

   deletePageById(stage, pageId: string) {
    DeleteOne(`${PAGES_URL}`, pageId)
    .then(() => this.commit('Page/_deletePersistedPageById', pageId))
    .catch((e) => console.error(e))
   }    
};

export default actions;
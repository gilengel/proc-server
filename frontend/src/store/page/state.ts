import { Page, NewPage } from 'src/models/Page'

export interface PageStateInterface {
  /**
   * Holds all pages that are persisted in the backend and requested by the client.
   * Be aware that this list does necessarily contain all of the pages from backend
   * side.
   *
   * @private
   * @type {Array<Page>}
   * @memberof PageStore
   */
   _persistedPages: Array<Page>

   /**
    * Holds all pages that were created on client side and not persisted on
    * backend side
    *
    * @private
    * @type {Array<NewPage>}
    * @memberof PageStore
    */
   _newPages: Array<NewPage>
}

function state(): PageStateInterface {
  return {
    _persistedPages: [],
    _newPages: []
  }
};

export default state;
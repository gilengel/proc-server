import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { NewPage, UpdateNewPage, Page } from 'components/flow/Page'
import { PostOne, UpdateOne, PAGES_URL } from '../models/Backend'

@Module
export default class PageStore extends VuexModule {
  /**
   * Holds all pages that are persisted in the backend and requested by the client.
   * Be aware that this list does necessarily contain all of the pages from backend
   * side.
   *
   * @private
   * @type {Array<Page>}
   * @memberof PageStore
   */
  private _persistedPages: Array<Page> = [];

  /**
   * Holds all pages that were created on client side and not persisted on
   * backend side
   *
   * @private
   * @type {Array<NewPage>}
   * @memberof PageStore
   */
  private _newPages: Array<NewPage> = [];

  /**
   * Returns all pages that are persisted in the backend and requested by the client.
   * Be aware that this list does necessarily contain all of the pages from backend
   * side.
   *
   * @readonly
   * @type {Array<Page>}
   * @memberof PageStore
   */
  get persistedPages(): Array<Page> {
    return this._persistedPages;
  }

  /**
   * Returns all pages that were created on client side and not persisted on
   * backend side
   *
   * @readonly
   * @type {Array<NewPage>}
   * @memberof PageStore
   */
  get newPages(): Array<NewPage> {
    return this._newPages;
  }

  /**
   * Returns a persisted page by its id.
   *
   * @param page_id The uuid of the page
   * @returns Page if page is found, undefined if not
   */
  get persistedPage() {
    return (uuid: string): Page | undefined => {
      return this._persistedPages.find((page: Page) => page.page_id === uuid)
    }
  }

  /**
   * Returns a not yet persisted page by its id.
   *
   * @param page_id The uuid of the new page
   * @returns Page if page is found, undefined if not
   */
  get newPageById() {
    return (page_id: string): NewPage | undefined => {
      return this._newPages.find((page: NewPage) => page.page_id === page_id)
    }
  }

  /**
   * Updates an existing page on backend side and in local store
   * @param updatedPage
   */
  @Mutation
  _updatePage(updatedPage: Page) {
    // Persist the page on backend
    UpdateOne<Page>(`${PAGES_URL}/${updatedPage.page_id}`, updatedPage)

    // Update the page in the client store
    let found = this._persistedPages.find((page: Page) => page.page_pk === updatedPage.page_pk)

    if (found) {
      found = Object.assign({}, found, updatedPage);
    }
  }

  /**
   * Updates a new page on local store
   * @param updatedNewPage
   */
  @Mutation
  _updateNewPage(params: { page: NewPage, update: UpdateNewPage }) {
    let foundIndex = this._newPages.findIndex((page: NewPage) => page.page_id === params.page.page_id)

    if (foundIndex === -1) {
      return
    }

    if (params.update.name) {
      this._newPages[foundIndex].name = params.update.name
    }

      //found = Object.assign({}, found, params.update);

      //console.log(found)

    //console.log(this._newPages)
  }

  /**
   * Stores the new page in the local store
   * @param newPage
   */
  @Mutation
  _storeNewPage(newPage: NewPage) {
    this._newPages.push(newPage)
  }

  /**
   * Persists a new page to the backend and adding the result to the local store
   * @param newPage The page to be saved
   */
  @Mutation
  _persistNewPage(newPage: NewPage) {
    PostOne<NewPage, Page>(`${PAGES_URL}`, newPage)
      .then((page: Page) => {
        this._persistedPages.push(page);
      })
  }

  /**
   * Updates an already stored page in the store and in the backend.
   * @param page
   */
  @Action
  updatePage(page: Page) {
    this.context.commit('_updatePage', page)
  }

  /**
   * Updates an already stored new page in the store.
   * @param page
   */
  @Action
  updateNewPage(params: { page: NewPage, update: UpdateNewPage }) {
    this.context.commit('_updateNewPage', params)
  }

  /**
  * Adds a new page to the local store.
  * Be aware that the page is not persisted to backend. For this see @see persistNewPage.
  * @param newPage The page to be saved
  */
  @Action
  storeNewPage(page: NewPage) {
    this.context.commit('_storeNewPage', page)
  }

  /**
  * Persists a new page to the backend and adding the result to the local store.
  * In case you only want to store it to the local store withtout backend persistance @see storeNewPage.
  * @param newPage The page to be saved
  */
  @Action
  persistNewPage(page: NewPage) {
    this.context.commit('_persistNewPage', page)
  }
}

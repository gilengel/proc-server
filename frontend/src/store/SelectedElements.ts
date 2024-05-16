import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export const SELECTED_CLASS = "selected";

@Module
export default class SelectedElements extends VuexModule {
  /**
   * Holds all selected elements as HTMLElement plus
   * a corresponding model for each element. The model
   * is freely choosable by the user but cannot be null
   * or undefined
   *
   * @private
   * @type {Array<HTMLElement>}
   * @memberof SelectedElements
   */
  private _selectedElements: Array<string> = new Array();

  /**
   * Holds all selected models. The model
   * is freely choosable by the user but cannot be null
   * or undefined. Must have the same length as _selectedElements
   * and both indices correspond to each other
   *
   * @private
   * @type {Array<any>}
   * @memberof SelectedElements
   */
  private _selectedModels: Array<any> = new Array();

  /**
   * Returns all selected elements
   *
   * @readonly
   * @type {Array<HTMLElement>}
   * @memberof SelectedElements
   */
  get selectedElements(): Array<string> {
    return this._selectedElements;
  }

  /**
   * Returns all selected models
   *
   * @readonly
   * @type {Array<any>}
   * @memberof SelectedElements
   */
  get selectedModels(): Array<any> {
    return this._selectedModels;
  }

  @Mutation
  _clearSelectedElements() {
    for (const element of this._selectedElements) {
      const el = document.getElementById(element);
      if (el) {
        el.classList.remove(SELECTED_CLASS)
      }
    }
  }

  /**
   * Updates an existing page on backend side and in local store
   * @memberof SelectedElements
   */
  @Mutation
  _addSelectedElementAndModel(params: { elementId: string, model: any }) {
    this._selectedElements.push(params.elementId);
    this._selectedModels.push(params.model);

    const el = document.getElementById(params.elementId);
    if (el) {
      el.classList.add(SELECTED_CLASS);
    }
  }

  /**
   * Updates an existing page on backend side and in local store
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  @Mutation
  _removeSelectedElementAndModel(element: string, model: any) {
    const index = this._selectedElements.indexOf(element);

    if (index >= 0) {
      this._selectedElements.slice(index, 1);
      this._selectedModels.slice(index, 1);
    }

  }

  /**
   * Removes all stored elements and models
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  @Mutation
  _removeAllSelectedElementsAndModels() {

    this._selectedElements = [] //.slice(0, this._selectedElements.length)
    this._selectedModels = []
  }

  /**
   * Updates an already stored new page in the store.
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  @Action({ rawError: true })
  addSelectedElementAndModel(params: { element: string, model: any, clearPreviousSelected: boolean }) {
    if (params.clearPreviousSelected) {
      this.context.commit('_clearSelectedElements')
      this.context.commit('_removeAllSelectedElementsAndModels', null);
    }

    this.context.commit('_addSelectedElementAndModel', { elementId: params.element, model: params.model })
  }

  /**
   * Removes the selected element from the list of selected elements if it is contained within
   * @params {HTMLElement, any}
   * @memberof SelectedElements
   */
  @Action
  removeSelectedElementAndModel(params: { elementId: string, model: any }) {
    const el = document.getElementById(params.elementId);
    if (el) {
      el.classList.remove(SELECTED_CLASS)
    }

    this.context.commit('_removeSelectedElementAndModel', params)
  }

  /**
  * Removes all selected elements saved in the store
  * @memberof SelectedElements
  */
  @Action
  removeAllSelectedElementsAndModels() {
    this.context.commit('_clearSelectedElements')
    this.context.commit('_removeAllSelectedElementsAndModels', null);
  }
}

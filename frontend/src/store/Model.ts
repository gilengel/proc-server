import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

export interface IModel {
  uuid: string
  model: Map<string, unknown>
}

@Module
export default class Layout extends VuexModule {
  _models: Array<IModel> = [];
  modelssCount = 1;

  get models () {
    return this._models
  }

  get model () {
    return (uuid: string) => {
      const element = this._models.find((element: IModel) => element.uuid === uuid)

      if (element === undefined) {
        return undefined
      }

      return element.model
    }
  }

  @Mutation
  _updateModel (params: IModel) {
    const found = this._models.find((element: IModel) => element.uuid === params.uuid)

    if (!found) {
      this._models.push(params)

      return
    }

    found.model = Object.assign({}, found.model, params.model)
  }

  @Action
  updateModel (params: IModel) {
    this.context.commit('_updateModel', params)
  }
}

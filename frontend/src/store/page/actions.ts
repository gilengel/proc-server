import { ActionContext, ActionTree } from 'vuex';
import { StateInterface } from '../index';
import { PageState } from './state';
import { Page, NewPage, UpdateNewPage } from 'src/models/Page';
import { Mutations, PageMutationTypes } from './mutations';


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

};

export default actions;

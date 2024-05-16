import Vue from 'vue'
import Vuex from 'vuex'
import Page from './Page'
import SelectedElements from './SelectedElements'
import Model from './Model'
import GridModule from './GridModule'
import Style from './Style'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

let store: unknown = null

Vue.use(Vuex)

export default function () {
  const Store = new Vuex.Store({
    modules: {
      GridModule,
      Model,
      Page,
      SelectedElements,
      Style
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: !!process.env.DEBUGGING
  })

  // add this so that we export store
  store = Store

  // Quasar default
  return Store
}

// add this line to access store wherever you need
export { store }

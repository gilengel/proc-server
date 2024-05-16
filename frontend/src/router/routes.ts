import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },

  {
    path: '/page_builder/:id',
    component: () => import('layouts/PageBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageBuilder.vue') }
    ]
  },



  // Route to create forms
  {
    path: '/page_builder',
    component: () => import('layouts/PageBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageBuilder.vue') }
    ]
  },

  // TODO: Currently only used for debugging forms
  {
    path: '/ui_form',
    component: () => import('layouts/UiFormLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiForm.vue') }
    ]
  },

  {
    path: '/ui_builder',
    component: () => import('src/layouts/UiBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('pages/UiBuilder.vue') }
    ]
  },

  // Application flow builder
  {
    path: '/page_flow_builder/:id',
    component: () => import('layouts/PageFlowBuilderLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/PageFlowBuilder.vue') }
    ]
  },

  // Application flow created by an user
  {
    path: '/page_flow/:id',
    component: () => import('layouts/PageFlowLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageBuilder.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes

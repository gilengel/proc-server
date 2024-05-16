import InputComponent from './Input'
import OutputComponent from './Output'
import { Component } from 'rete'

export interface MetaFlowCategory {
  readonly label: string;
  readonly icon: string;

  readonly components: Array<MetaFlowComponent>
}

export interface MetaFlowComponent {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly component: Component,
  readonly defaultData: Record<string, unknown>
}

const basicCategory: MetaFlowCategory = {
  label: 'Basic',
  icon: '',

  components: [
    {
      id: 'input',
      label: 'Input',
      icon: 'las la-map-marked',
      component: InputComponent,
      defaultData: {}
    },
    {
      id: 'output',
      label: 'Output',
      icon: 'las la-map-marked',
      component: OutputComponent,
      defaultData: {}
    },
  ]
}

// Unfortunatly vue does not support Maps for v-for which is necessary to display the registered components.
// Therefore we use an Array, see https://github.com/vuejs/vue/issues/6644
export function getRegisteredComponentCategories(): Array<MetaFlowCategory> {
  return [basicCategory]
}

export function findRegisteredComponentById(id: string): MetaFlowComponent | undefined {
  for (const category of getRegisteredComponentCategories()) {
    const component = category.components.find(component => component.id === id)

    if (component) {
      return component
    }
  }

  return undefined
}


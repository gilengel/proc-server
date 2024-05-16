import { FlowComponent } from '../models/Component'
import OutputControlVue from 'src/components/controls/OutputControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'Output',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  controls: [
    {
      identifier: 'variable',
      component: OutputControlVue
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve) => {
      resolve()
    })
  }
})

import { FlowComponent } from '../models/Component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import NameControl from 'src/components/controls/NameControl.vue'

export default new FlowComponent({
  label: 'SplitObject',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    }
  ],

  outputs: [
  ],

  controls: [
    {
      identifier: 'variable',
      component: NameControl
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
    return new Promise((resolve) => {
      console.log(node)
      resolve()
    })
  }
})

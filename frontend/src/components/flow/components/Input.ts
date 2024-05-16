import { FlowComponent } from '../models/Component'
import InputControlVue from 'src/components/controls/InputControl.vue'
import TypeControlVue from 'components/controls/TypeControl.vue'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'

export default new FlowComponent({
  label: 'Input',

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,

      control: {
        component: TypeControlVue
      }
    }
  ],

  controls: [
    {
      identifier: 'create_output_pin',
      component: InputControlVue
    }
  ],

  workerFn: (
    node: NodeData,
    inputs: WorkerInputs,
    outputs: WorkerOutputs
  ): Promise<void> => {
      return new Promise((resolve) => {
        console.log(`Input 5Mark täglich`)
      resolve()
    })
  }
})

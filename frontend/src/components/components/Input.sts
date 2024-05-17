import { FlowComponent } from '../flow/models/Component';
import InputControlVue from 'src/components/controls/InputControl.vue';
import TypeControlVue from 'components/controls/TypeControl.vue';
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';

export default new FlowComponent({
  label: 'Input',

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,

      control: {
        component: TypeControlVue,
      },
    },
  ],

  controls: [
    {
      identifier: 'create_output_pin',
      component: InputControlVue,
    },
  ],

  workerFn: (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    node: NodeData,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    inputs: WorkerInputs,

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    outputs: WorkerOutputs,
  ): Promise<void> => {
    return new Promise((resolve) => {
      console.log('Input Muu');
      resolve();
    });
  },
});

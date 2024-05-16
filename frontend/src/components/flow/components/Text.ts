import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data';
import { FlowComponent } from '../models/Component';

export default new FlowComponent({
  label: 'Text',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
    },
  ],

  outputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,
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
      resolve();
    });
  },
});

import { FlowComponent } from "components/flow/models/Component";
import NumberControl from "components/controls/NumberControl.vue"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export const WIDGET_FLOW_ROUTER_OUTPUT = "output";

export default new FlowComponent({
  label: WIDGET_FLOW_ROUTER_OUTPUT,


  inputs: [
    {
      type: "page",
      label: "Input",
      mandatory: true,


      control: {
        identifier: 'amount',
        component: NumberControl,
        isValid: (input: unknown): boolean => {
          const number = input as number

          return (number >= 0 && number <= 20000)
        }
      }
    },
  ],

  workerFn: (
    node: NodeData,
    _inputs: WorkerInputs,
    _outputs: WorkerOutputs,
  ): Promise<void> => {
    return new Promise((resolve) => {
      // Default do noting
      resolve();
    });
  },
});

import { FlowComponent } from "components/flow/models/Component";
import DimensionControl from "components/controls/DimensionControl.vue"
import { NodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";

export const WIDGET_FLOW_ROUTER_INPUT = "input";

export default new FlowComponent({
  label: WIDGET_FLOW_ROUTER_INPUT,

  outputs: [
    {
      type: "page",
      label: "Input",
      mandatory: true,


      control: {
        identifier: 'amount',
        component: DimensionControl,
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

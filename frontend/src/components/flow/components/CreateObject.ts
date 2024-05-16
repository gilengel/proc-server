import { FlowComponent } from '../models/Component'
import { NodeData, WorkerInputs, WorkerOutputs } from 'rete/types/core/data'
import TypeControlVue from 'src/components/controls/TypeControl.vue'
import OutputControlVue from 'src/components/controls/OutputControl.vue'

import { ElementAttributeType } from "src/models/Grid";

import { VariableModel } from "src/models/Variable";

function convertVariableToFlatbuffer(identifier: string, type: ElementAttributeType): string {
  let result = '';
  switch (type) {
    case ElementAttributeType.Boolean: {
      result = `  ${identifier}:bool`;
      break;
    }
    case ElementAttributeType.Number: {
      result = `  ${identifier}:double`;
      break;
    }
    case ElementAttributeType.String: {
      result = `  ${identifier}:string`;
      break;
    }
    case ElementAttributeType.Coolection: {
      throw new Error("Collection is currently not supported as output variable")
    }
  }

  result += ";\n"

  return result
}

export default new FlowComponent({
  label: 'CreateObject',

  inputs: [
    {
      type: 'variable',
      label: 'Variable',
      mandatory: true,

      control: {
        identifier: 'variable0',
        component: TypeControlVue
      }
    }
  ],

  outputs: [
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
      const data = node.data as Record<string, VariableModel>
      const result = new Array()

      let flatbuffer = 'struct Pobres {\n';
      for (const key in data) {
        const entry = data[key]

        flatbuffer += convertVariableToFlatbuffer(entry.identifier, entry.type)
      }
      flatbuffer += "}"

      outputs['variable'] = flatbuffer

      resolve()
    })
  }
})

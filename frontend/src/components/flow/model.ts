import { ClassicPreset } from 'rete';
import { AvailableSockets } from '../ui_builder/elementLoader';

/**
 * @template ElementType          Enum of allowed elements that are allowed in the
 *                                flow editor
 * @template ElementAttributeType Enum of allowed attributes that can be passed from
 *                                one element pin to another
 */
export class FlowElement<
  ElementType extends string,
  ElementAttributeType extends string,
> extends ClassicPreset.Node {
  constructor(
    public type: ElementType,
    inputs?: ElementPin<ElementAttributeType>[],
    outputs?: ElementPin<ElementAttributeType>[],
  ) {
    super(type);

    const addPin = (
      pin: ElementPin<ElementAttributeType>,
      callback: (socket: ClassicPreset.Socket) => void,
    ) => {
      const socket = AvailableSockets.find(
        (socket) => socket.name === pin.type,
      );
      if (!socket) {
        console.error(
          `Socket of type "${pin.type}" does not exist on the FlowEditor instance. Was it added in the socket property?`,
        );
        return;
      }

      callback(socket);
    };

    if (inputs) {
      for (const input of inputs) {
        addPin(input, (socket) =>
          this.addInput(input.type, new ClassicPreset.Input(socket)),
        );
      }

      if (outputs) {
        for (const output of outputs) {
          addPin(output, (socket) =>
            this.addOutput(output.type, new ClassicPreset.Output(socket)),
          );
        }
      }
    }
  }
  //type: ElementType;
  //uuid: string;
  //inputs?: ElementPin<ElementAttributeType>[];
  //outputs?: ElementPin<ElementAttributeType>[];
}

/**
 * Either input or output.
 */
export type ElementPin<T> = {
  type: T;
  identifier: string;
  connection?: FlowElementConnection;
  children?: ElementPin<T>[];
};

/**
 * Connection between two pins
 */
export type FlowElementConnection = {
  uuid: string;
  input: string;
  output: string;

  value?: unknown;
};

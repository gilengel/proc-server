import { ElementAttributeType } from 'src/models/Grid';
import { NodeEditor, Node as ReteNode } from 'rete';

export interface ControlProps {
  emitter?: NodeEditor;

  propertyKey?: string;

  // eslint-disable-next-line @typescript-eslint/ban-types
  getData?: Function;

  // eslint-disable-next-line @typescript-eslint/ban-types
  putData: (
    key: string,
    value: { identifier: string; type: ElementAttributeType },
  ) => void;

  // eslint-disable-next-line @typescript-eslint/ban-types
  isValid?: Function;

  node: ReteNode;
}

/**
 * @template ElementType          Enum of allowed elements that are allowed in the
 *                                flow editor
 * @template ElementAttributeType Enum of allowed attributes that can be passed from
 *                                one element pin to another
 */
export type FlowElement<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  type: ElementType;
  uuid: string;
  inputs?: ElementPin<ElementAttributeType>[];
  outputs?: ElementPin<ElementAttributeType>[];
};

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

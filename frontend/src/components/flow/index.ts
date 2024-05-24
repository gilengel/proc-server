import { FlowElement } from './model';

export type MetaFlowCategory<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  readonly label: string;
  readonly icon: string;

  readonly elements: MetaFlowElement<ElementType, ElementAttributeType>[];
};

export type MetaFlowElement<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  readonly type: ElementType;
  readonly label: string;
  readonly icon: string;

  readonly defaultData?: Record<string, unknown>;
  readonly defaultElement: FlowElement<ElementType, ElementAttributeType>;
};

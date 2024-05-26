import { FlowElement } from './model';

export type LabelWithIcon = {
  label: string;
  icon: string;
};

export type MetaFlowCategoryElement<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  create(): FlowElement<ElementType, ElementAttributeType>;

  type: ElementType;
} & LabelWithIcon;

export type MetaFlowCategory<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  readonly elements: MetaFlowCategoryElement<
    ElementType,
    ElementAttributeType
  >[];
} & LabelWithIcon;

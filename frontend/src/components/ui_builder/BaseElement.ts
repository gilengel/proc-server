import { Element, ElementAttribute } from 'src/models/Grid';

export interface IBaseElementProps<T extends string, S extends string> {
  uuid: string;

  editable: boolean;
  model: Element<T, S>;

  updateElementAttribute?: (param: {
    element: Element<T, S>;
    name: string;
    value: unknown;
  }) => void;

  setConnectionValue?: (param: {
    element: Element<T, S>;
    name: string;
    value: unknown;
  }) => void;
}

export interface IEditableBaseElementProps<T extends string, S extends string>
  extends IBaseElementProps<T, S> {
  editable: boolean;
}

export function getValueOfAttribute<
  T extends string,
  S extends string,
  ReturnType,
>(name: string, model: Element<T, S>): ReturnType | undefined {
  const attribute = model.attributes.find(
    (attribute) => attribute.name === name,
  ) as ElementAttribute;

  if (!attribute) {
    return undefined;
  }

  return attribute.value as ReturnType;
}

export function setValueOfAttribute<T extends string, S extends string, Type>(
  name: string,
  value: Type,
  props: IBaseElementProps<T, S>,
) {
  if (!props.updateElementAttribute) {
    return;
  }

  props.updateElementAttribute({
    element: props.model,
    name: name,
    value: value,
  });
}

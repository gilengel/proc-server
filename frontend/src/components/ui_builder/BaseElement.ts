import { Element, ElementAttribute } from 'src/models/Grid';

export interface IBaseElementProps {
  uuid: string;

  editable: boolean;
  model: Element;

  updateElementAttribute?: (param: {
    element: Element;
    name: string;
    value: unknown;
  }) => void;

  setConnectionValue?: (param: {
    element: Element;
    name: string;
    value: unknown;
  }) => void;
}

export interface IEditableBaseElementProps extends IBaseElementProps {
  editable: boolean;
}

export function getValueOfAttribute<T>(
  name: string,
  model: Element,
): T | undefined {
  const attribute = model.attributes.find(
    (attribute) => attribute.name === name,
  ) as ElementAttribute;

  if (!attribute) {
    return undefined;
  }

  return attribute.value as T;
}

export function setValueOfAttribute(
  name: string,
  value: unknown,
  props: IBaseElementProps,
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

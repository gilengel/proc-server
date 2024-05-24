export { default as Element } from './ButtonElement.vue';
export { default as Options } from '../AttributeOptions.vue';

import {
  ElementAttribute,
  ElementAttributeType,
  ElementType,
  Element as Model,
} from '../../../models/Grid';

import * as uuid from 'uuid';
import { IBaseElementProps } from '../BaseElement';
import { CustomAttributeOptionElements } from 'src/boot/ui-builder';

export function createDefaultProps(model: Model): IBaseElementProps {
  return {
    uuid: uuid.v4(),
    editable: true,
    model,
  };
}

export function createDefaultAttributes(): ElementAttribute[] {
  const attributes: ElementAttribute[] = [];
  attributes.push({
    name: 'type',
    type: ElementAttributeType.String,
    value: 'button',
  });
  attributes.push({
    name: 'icon',
    type: ElementAttributeType.String,
    value: 'lab la-behance-square',

    component: CustomAttributeOptionElements.IconList,
  });
  attributes.push({
    name: 'hasIcon',
    type: ElementAttributeType.Boolean,
    value: true,
  });
  attributes.push({
    name: 'isHighlighted',
    type: ElementAttributeType.Boolean,
    value: true,
  });
  attributes.push({
    name: 'label',
    type: ElementAttributeType.String,
    value: 'Button',
  });

  return attributes;
}

export function createDefaultElement() {
  return new Model(ElementType.Button, createDefaultAttributes());
}

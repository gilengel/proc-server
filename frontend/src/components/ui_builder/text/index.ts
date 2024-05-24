export { default as Element } from './TextElement.vue';
export { default as Options } from '../AttributeOptions.vue';

import {
  ElementAttribute,
  ElementAttributeType,
  ElementType,
  Element as Model,
} from '../../../models/Grid';

import * as uuid from 'uuid';
import { IBaseElementProps } from '../BaseElement';

export function createDefaultProps(model: Model): IBaseElementProps {
  return {
    uuid: uuid.v4(),
    editable: true,
    model,
  };
}

export function createDefaultAttributes() {
  const attributes: ElementAttribute[] = [];

  attributes.push({
    name: 'variable',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });
  attributes.push({
    name: 'value',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });
  attributes.push({
    name: 'placeholder',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });

  attributes.push({
    name: 'label',
    type: ElementAttributeType.String,
    value: 'Some text',
  });
  attributes.push({
    name: 'type',
    type: ElementAttributeType.Collection,
    value: 'text',
    options: [
      'text',
      'password',
      'textarea',
      'email',
      'search',
      'tel',
      'file',
      'number',
      'url',
      'time',
      'date',
      'datetime-local',
    ],
  });
  attributes.push({
    name: 'withLabel',
    type: ElementAttributeType.Boolean,
    value: true,
  });

  return attributes;
}

export function createDefaultElement() {
  return new Model(
    ElementType.Text,
    createDefaultAttributes(),
    [
      {
        type: ElementAttributeType.String,
        identifier: 'value',
      },
    ],
    [
      {
        type: ElementAttributeType.String,
        identifier: 'value',
      },
    ],
  );
}

export { default as Element } from './TextElement.vue';
export { default as Options } from '../AttributeOptions.vue';

import { ElementAttributeType, Element as Model } from '../../../models/Grid';

import * as uuid from 'uuid';
import { IBaseElementProps } from '../BaseElement';

export function createDefaultProps(model: Model): IBaseElementProps {
  return {
    uuid: uuid.v4(),
    editable: true,
    model,
  };
}

export function createDefaultAttributes(element: Model) {
  element.attributes.push({
    name: 'variable',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });
  element.attributes.push({
    name: 'placeholder',
    type: ElementAttributeType.String,
    value: 'Some_text',
  });

  element.attributes.push({
    name: 'label',
    type: ElementAttributeType.String,
    value: 'Some text',
  });
  element.attributes.push({
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
  element.attributes.push({
    name: 'withLabel',
    type: ElementAttributeType.Boolean,
    value: true,
  });
}

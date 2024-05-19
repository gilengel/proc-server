export { default as Element } from './HeadingElement.vue';
export { default as Options } from './HeadingOptions.vue';

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
    name: 'type',
    type: ElementAttributeType.Collection,
    options: ['h1', 'h2', 'h3', 'h4'],
    value: 'h1',
  });
}

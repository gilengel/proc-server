export { default as Element } from './ImageElement.vue';
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
    name: 'src',
    type: ElementAttributeType.String,
    value: 'https://picsum.photos/200/300',
  });

  element.attributes.push({
    name: 'aspect_ratio',
    type: ElementAttributeType.Collection,
    options: ['1', '16/9', '4/3'],
    value: '1',
  });
}

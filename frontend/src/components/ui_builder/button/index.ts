export { default as Element } from './ButtonElement.vue';
export { default as Options } from '../AttributeOptions.vue';

import { ElementAttributeType, Element as Model } from '../../../models/Grid';

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

export function createDefaultAttributes(element: Model) {
  element.attributes.push({
    name: 'type',
    type: ElementAttributeType.String,
    value: 'button',
  });
  element.attributes.push({
    name: 'icon',
    type: ElementAttributeType.String,
    value: 'lab la-behance-square',

    component: CustomAttributeOptionElements.IconList,
  });
  element.attributes.push({
    name: 'hasIcon',
    type: ElementAttributeType.Boolean,
    value: true,
  });
  element.attributes.push({
    name: 'isHighlighted',
    type: ElementAttributeType.Boolean,
    value: true,
  });
  element.attributes.push({
    name: 'label',
    type: ElementAttributeType.String,
    value: 'Button',
  });
}

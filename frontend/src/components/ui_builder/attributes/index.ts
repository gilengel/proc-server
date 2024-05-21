export { default as Collection } from './CollectionOption.vue';
export { default as Text } from './TextOption.vue';
export { default as Toggle } from './ToggleOption.vue';
export { default as IconList } from './IconListOption.vue';

import { Element } from 'src/models/Grid';

export interface IOptionProps {
  attributeKey: string;

  model: Element;
  label: string;
}

export { default as Collection } from './CollectionOption.vue';
export { default as Text } from './TextOption.vue';
export { default as Toggle } from './ToggleOption.vue';

import { Element } from 'src/models/Grid';

export interface IOptionProps {
  attributeKey: string;

  model: Element;
  label: string;
}

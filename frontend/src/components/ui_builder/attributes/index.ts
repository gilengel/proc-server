export { default as Collection } from './CollectionOption.vue';
export { default as Text } from './TextOption.vue';
export { default as Toggle } from './ToggleOption.vue';
export { default as IconList } from './IconListOption.vue';

import { Element } from 'src/models/Grid';

export interface IOptionProps<T extends string, S extends string> {
  attributeKey: string;

  model: Element<T, S>;
  label: string;
}

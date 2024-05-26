import { IBaseElementProps } from './BaseElement';

import { ElementAttribute, Element as Model } from 'src/models/Grid';
import { Component } from 'vue';

export type El<T extends string, S extends string> = {
  createDefaultProps(model: Model<T, S>): IBaseElementProps<T, S>;
  createDefaultAttributes(): ElementAttribute[];
  createDefaultElement(): Model<T, S>;

  Element: Component;
  Options: Component;
};

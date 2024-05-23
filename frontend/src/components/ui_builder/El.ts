import { IBaseElementProps } from './BaseElement';

import { ElementAttribute, Element as Model } from 'src/models/Grid';
import { Component } from 'vue';

export type El = {
  createDefaultProps(model: Model): IBaseElementProps;
  createDefaultAttributes(): ElementAttribute[];
  createDefaultElement(): Model;

  Element: Component;
  Options: Component;
};

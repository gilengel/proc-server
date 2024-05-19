import { IBaseElementProps } from './BaseElement';

import { Element as Model } from '../../models/Grid';
import { Component } from 'vue';

export type El = {
  createDefaultProps(model: Model): IBaseElementProps;
  createDefaultAttributes(element: Model): void;

  Element: Component;
  Options: Component;
};

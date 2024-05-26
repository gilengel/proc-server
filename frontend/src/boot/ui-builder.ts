import { boot } from 'quasar/wrappers';
import IconListOption from 'src/components/ui_builder/attributes/IconListOption.vue';
import { loadAllModules } from 'src/components/ui_builder/elementLoader';
import { ElementAttributeType, FormType } from 'src/models/Grid';

export enum CustomAttributeOptionElements {
  IconList = 'IconList',
}

export function getCustomAttributeOptionElement(
  element: CustomAttributeOptionElements,
) {
  switch (element) {
    case CustomAttributeOptionElements.IconList: {
      return IconListOption;
    }
  }

  return undefined;
}

export default boot(() => {
  // makes all dynamic (form) elements available to the ui editor
  loadAllModules<FormType, ElementAttributeType>();
});

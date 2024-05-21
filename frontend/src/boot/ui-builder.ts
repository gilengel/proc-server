import { boot } from 'quasar/wrappers';
import IconListOption from 'src/components/ui_builder/attributes/IconListOption.vue';

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

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$ui_builder = 'hello world';
});

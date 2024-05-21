import { boot } from 'quasar/wrappers';
import IconList from 'src/components/ui_builder/button/IconList.vue';

export enum CustomAttributeOptionElements {
  IconList = 'IconList',
}

export function getCustomAttributeOptionElement(
  element: CustomAttributeOptionElements,
) {
  switch (element) {
    case CustomAttributeOptionElements.IconList: {
      return IconList;
    }
  }

  return undefined;
}

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$ui_builder = 'hello world';
});

import { getValueOfAttribute } from 'src/components/ui_builder/BaseElement';
import { computed } from 'vue';

import { Element } from 'src/models/Grid';
import { useGridModuleStore } from 'src/stores/gridModule';

export function useChangeableComputedAttributeModel<
  T extends string,
  S extends string,
  Type extends string | number | boolean,
>(
  key: string,
  element: Element<T, S>,
  store: ReturnType<typeof useGridModuleStore<T, S>>,
) {
  return computed({
    get() {
      return getValueOfAttribute(key, element) as Type;
    },

    set(newValue: Type) {
      store.updateElementAttribute(element, key, newValue);
    },
  });
}

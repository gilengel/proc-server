import { getValueOfAttribute } from 'src/components/ui_builder/BaseElement';
import { computed } from 'vue';

import { Element } from 'src/models/Grid';
import { useGridModuleStore } from 'src/stores/gridModule';

const gridModuleStore = useGridModuleStore();

export function useChangleableComputedAttributeModel<
  T extends string | number | boolean,
>(key: string, element: Element) {
  return computed({
    get() {
      return getValueOfAttribute(key, element) as T;
    },

    set(newValue: T) {
      gridModuleStore.updateElementAttribute(element, key, newValue);
    },
  });
}

import { getValueOfAttribute } from 'src/components/ui_builder/BaseElement';
import { computed } from 'vue';

import { Element } from 'src/models/Grid';

export function useComputedAttributeModel<
  T extends string | number | boolean | undefined,
>(key: string, element: Element) {
  return computed(() => getValueOfAttribute(key, element) as T);
}

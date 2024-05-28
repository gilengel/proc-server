<template>
  <div data-testid="button-element">
    <q-btn
      text-color="white"
      :flat="!isHighlighted"
      :label
      :icon
      :type="type"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { computed } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

const props = defineProps<IBaseElementProps<T, S>>();

const type = useComputedAttributeModel<T, S, string>('type', props.model);

const label = useComputedAttributeModel<T, S, string>('label', props.model);

const isHighlighted = useComputedAttributeModel<T, S, boolean>(
  'isHighlighted',
  props.model,
);

const icon = computed(() => {
  const hasIcon = getValueOfAttribute<T, S, string>('hasIcon', props.model);
  if (!hasIcon) {
    return undefined;
  }

  return getValueOfAttribute<T, S, string>('icon', props.model);
});
</script>

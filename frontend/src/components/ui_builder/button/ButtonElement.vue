<template>
  <div>
    <q-btn
      text-color="white"
      :flat="!isHighlighted"
      :label
      :icon
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

const props = defineProps<IBaseElementProps>();

const type = useComputedAttributeModel<string>('type', props.model);

const label = useComputedAttributeModel<string>('label', props.model);

const isHighlighted = useComputedAttributeModel<boolean>(
  'isHighlighted',
  props.model,
);

const icon = computed(() => {
  const hasIcon = getValueOfAttribute<string>('hasIcon', props.model);
  if (!hasIcon) {
    return undefined;
  }

  return getValueOfAttribute<string>('icon', props.model);
});

/*
const hasIcon = computed(() => {
  return getValueOfAttribute('hasIcon', props.model);
});
*/
</script>

<style scoped lang="scss"></style>

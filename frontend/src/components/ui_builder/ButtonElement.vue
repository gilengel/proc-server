<template>
  <div>
    <q-btn
      text-color="white"
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IBaseElementProps, getValueOfAttribute } from './BaseElement';
const props = defineProps<IBaseElementProps>();

let type = computed(() => getValueOfAttribute<string>('type', props));
let label = computed(() => getValueOfAttribute<string>('label', props));
let isHighlighted = computed(() =>
  getValueOfAttribute<boolean>('isHighlighted', props),
);
let icon = computed(() => getValueOfAttribute<boolean>('icon', props));
let hasIcon = computed(() => getValueOfAttribute<boolean>('hasIcon', props));

let previewIcon = computed(() => {
  let result;

  if (hasIcon && icon.value) {
    result = icon;
  }

  return result;
});
</script>

<style lang="scss" scoped>
div {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

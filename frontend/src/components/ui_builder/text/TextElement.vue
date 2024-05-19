<template>
  <div class="el-text">
    <q-input
      dark
      :label
      :placeholder
      :type
      :readonly="!editable"
      v-model="text"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';

const props = defineProps<IBaseElementProps>();

const placeholder = computed(() => {
  return getValueOfAttribute('placeholder', props.model);
});

const withLabel = computed(() => {
  return getValueOfAttribute('withLabel', props.model);
});

const label = computed(() => {
  if (!withLabel.value) {
    return undefined;
  }

  return getValueOfAttribute<string>('label', props.model);
});

const type = computed(() => {
  type InputType =
    | 'text'
    | 'password'
    | 'textarea'
    | 'email'
    | 'search'
    | 'tel'
    | 'file'
    | 'number'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | undefined;
  return getValueOfAttribute<InputType>('type', props.model);
});

const hover = ref(false);

const text = ref('');
</script>

<style scoped lang="scss">
.el-text {
  z-index: 2;

  user-select: none;
}
.el-text ::after {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  background: transparent;

  content: ' ';
}
</style>

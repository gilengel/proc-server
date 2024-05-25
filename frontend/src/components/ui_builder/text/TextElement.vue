<template>
  <div class="el-text">
    <q-input
      dark
      :label
      :placeholder
      :type
      :readonly="!editable"
      v-model="value"
      @update:model-value="emit('onElementChanged', model)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { Element } from 'src/models/Grid';

const props = defineProps<IBaseElementProps>();

const placeholder = useComputedAttributeModel('placeholder', props.model);

const withLabel = useComputedAttributeModel('withLabel', props.model);

const label = computed(() => {
  if (!withLabel.value) {
    return undefined;
  }

  return getValueOfAttribute<string>('label', props.model);
});

const value = useChangeableComputedAttributeModel<string>('value', props.model);

const emit = defineEmits<{
  onElementChanged: [element: Element];
}>();

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
const type = useComputedAttributeModel<InputType>('type', props.model);
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

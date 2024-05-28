<template>
  <div class="el-text">
    <q-input
      dark
      disable
      :label
      :placeholder
      :type
      :readonly="!editable"
      v-model="value"
      @update:model-value="emit('onElementChanged', model)"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { computed } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { Element } from 'src/models/Grid';
import { useGridModuleStore } from 'src/stores/gridModule';

const props = defineProps<IBaseElementProps<T, S>>();

const placeholder = useComputedAttributeModel('placeholder', props.model);

const withLabel = useComputedAttributeModel('withLabel', props.model);

const label = computed(() => {
  if (!withLabel.value) {
    return undefined;
  }

  return getValueOfAttribute<T, S, string>('label', props.model);
});

const gridStore = useGridModuleStore();

const value = useChangeableComputedAttributeModel<T, S, string>(
  'value',
  props.model,
  gridStore,
);

const emit = defineEmits<{
  onElementChanged: [element: Element<T, S>];
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
const type = useComputedAttributeModel<T, S, InputType>('type', props.model);
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

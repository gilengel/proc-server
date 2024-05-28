<template>
  <div data-testid="toggle-option">
    <q-toggle
      v-model="model"
      :label
      color="primary"
      data-testid="toggle-model"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { computed } from 'vue';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { useGridModuleStore } from 'src/stores/gridModule';

const props = defineProps<IOptionProps<T, S>>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const gridStore = useGridModuleStore<T, S>();

const model = useChangeableComputedAttributeModel<T, S, boolean>(
  props.attributeKey,
  props.model,
  gridStore,
);
</script>

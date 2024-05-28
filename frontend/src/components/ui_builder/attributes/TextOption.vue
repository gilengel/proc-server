<template>
  <div data-testid="text-option">
    <q-input
      v-model="model"
      :label
      color="primary"
      data-testid="text-option-input"
    />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { camelCaseToWords } from 'src/textUtil';
import { computed } from 'vue';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { useGridModuleStore } from 'src/stores/gridModule';

const props = defineProps<IOptionProps<T, S>>();

const gridStore = useGridModuleStore();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangeableComputedAttributeModel<T, S, string>(
  props.attributeKey,
  props.model,
  gridStore,
);
</script>

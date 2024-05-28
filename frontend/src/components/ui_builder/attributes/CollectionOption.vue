<template>
  <div>
    <q-select dark v-model="model" :label :options />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { computed } from 'vue';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { useGridModuleStore } from 'src/stores/gridModule';

interface ICollectionOptionProps extends IOptionProps<T, S> {
  options: string[];
}

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const props = defineProps<ICollectionOptionProps>();

const gridStore = useGridModuleStore();

const model = useChangeableComputedAttributeModel(
  props.attributeKey,
  props.model,
  gridStore,
);
</script>

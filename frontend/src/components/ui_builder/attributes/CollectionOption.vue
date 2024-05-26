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

interface ICollectionOptionProps extends IOptionProps<T, S> {
  options: string[];
}

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const props = defineProps<ICollectionOptionProps>();

const model = useChangeableComputedAttributeModel(
  props.attributeKey,
  props.model,
);
</script>

<template>
  <div>
    <q-select dark v-model="model" :label :options />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';
import { useChangleableComputedAttributeModel } from 'src/composables/useChangleableComputedAttributeModel';

interface ICollectionOptionProps extends IOptionProps {
  options: string[];
}

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const props = defineProps<ICollectionOptionProps>();

const model = useChangleableComputedAttributeModel(
  props.attributeKey,
  props.model,
);
</script>

<style scoped></style>

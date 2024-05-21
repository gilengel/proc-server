<template>
  <div>
    <q-toggle v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';
import { useChangleableComputedAttributeModel } from 'src/composables/useChangleableComputedAttributeModel';

const props = defineProps<IOptionProps>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangleableComputedAttributeModel<boolean>(
  props.attributeKey,
  props.model,
);
</script>

<style scoped></style>

<template>
  <div>
    <q-input v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { camelCaseToWords } from 'src/textUtil';
import { computed } from 'vue';
import { IOptionProps } from '.';
import { useChangleableComputedAttributeModel } from 'src/composables/useChangleableComputedAttributeModel';

const props = defineProps<IOptionProps>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangleableComputedAttributeModel<string>(
  props.attributeKey,
  props.model,
);
</script>

<style scoped></style>

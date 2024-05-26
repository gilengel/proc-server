<template>
  <div>
    <q-input v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { camelCaseToWords } from 'src/textUtil';
import { computed } from 'vue';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';

const props = defineProps<IOptionProps<T, S>>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangeableComputedAttributeModel<T, S, string>(
  props.attributeKey,
  props.model,
);
</script>

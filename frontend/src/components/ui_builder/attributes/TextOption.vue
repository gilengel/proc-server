<template>
  <div>
    <q-input v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { camelCaseToWords } from 'src/textUtil';
import { computed } from 'vue';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';

const props = defineProps<IOptionProps>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangeableComputedAttributeModel<string>(
  props.attributeKey,
  props.model,
);
</script>

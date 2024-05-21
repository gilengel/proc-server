<template>
  <div>
    <q-toggle v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';

const props = defineProps<IOptionProps>();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = useChangeableComputedAttributeModel<boolean>(
  props.attributeKey,
  props.model,
);
</script>

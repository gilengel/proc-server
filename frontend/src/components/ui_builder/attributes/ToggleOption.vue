<template>
  <div>
    <q-toggle v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getValueOfAttribute } from '../BaseElement';
import { useGridModuleStore } from 'src/stores/gridModule';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';

const props = defineProps<IOptionProps>();

const gridModuleStore = useGridModuleStore();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = computed({
  get() {
    return getValueOfAttribute<boolean>('withLabel', props.model) as boolean;
  },

  set(newValue: boolean) {
    gridModuleStore.updateElementAttribute(
      props.model,
      props.attributeKey,
      newValue,
    );
  },
});
</script>

<style scoped></style>

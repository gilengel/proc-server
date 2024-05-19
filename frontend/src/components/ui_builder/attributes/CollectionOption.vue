<template>
  <div>
    <q-select dark v-model="model" :label :options />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getValueOfAttribute } from '../BaseElement';
import { useGridModuleStore } from 'src/stores/gridModule';

import { camelCaseToWords } from 'src/textUtil';
import { IOptionProps } from '.';

interface ICollectionOptionProps extends IOptionProps {
  options: string[];
}

const gridModuleStore = useGridModuleStore();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const props = defineProps<ICollectionOptionProps>();

const model = computed({
  get() {
    return getValueOfAttribute<boolean>(
      props.attributeKey,
      props.model,
    ) as boolean;
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

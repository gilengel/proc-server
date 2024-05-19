<template>
  <div>
    <q-input v-model="model" :label color="primary" />
  </div>
</template>

<script setup lang="ts">
import { camelCaseToWords } from 'src/textUtil';
import { computed } from 'vue';
import { IOptionProps } from '.';
import { getValueOfAttribute } from '../BaseElement';
import { useGridModuleStore } from 'src/stores/gridModule';

const props = defineProps<IOptionProps>();

const gridModuleStore = useGridModuleStore();

const label = computed(() => {
  return camelCaseToWords(props.label);
});

const model = computed({
  get() {
    return getValueOfAttribute<string>(
      props.attributeKey,
      props.model,
    ) as string;
  },

  set(newValue: string) {
    gridModuleStore.updateElementAttribute(
      props.model,
      props.attributeKey,
      newValue,
    );
  },
});
</script>

<style scoped></style>

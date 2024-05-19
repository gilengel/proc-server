<template>
  <q-img :src alt="some image" :ratio />
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';

const props = defineProps<IBaseElementProps>();

const src = computed(() => {
  return getValueOfAttribute<string>('src', props.model);
});

const ratio = computed(() => {
  return getValueOfAttribute<string>('aspect_ratio', props.model);
});
</script>

<style scoped lang="scss"></style>

<template>
  <q-img :src alt="some image" :ratio />
</template>

<script setup lang="ts">
import { IBaseElementProps } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

const props = defineProps<IBaseElementProps>();

const src = useComputedAttributeModel<string>('src', props.model);

const ratio = useComputedAttributeModel<string>('aspect_ratio', props.model);
</script>

<style scoped lang="scss"></style>

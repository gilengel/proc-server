<template>
  <q-img :src alt="some image" :ratio data-testid="image-element" />
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { IBaseElementProps } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

const props = defineProps<IBaseElementProps<T, S>>();

const src = useComputedAttributeModel<T, S, string>('src', props.model);

const ratio = useComputedAttributeModel<T, S, string>(
  'aspect_ratio',
  props.model,
);
</script>

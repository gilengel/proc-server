<template>
  <div class="el-text">
    <component :is="type">Heading</component>
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { IBaseElementProps } from '../BaseElement';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

export interface IHeadingElementProps<T extends string, S extends string>
  extends IBaseElementProps<T, S> {
  editable: boolean;
}

const props = defineProps<IHeadingElementProps<T, S>>();

const type = useComputedAttributeModel('type', props.model);
</script>

<style lang="scss" scoped>
h1 {
  color: white;
  font-size: 2em;
  padding: 0;
  margin: 0;
}
</style>

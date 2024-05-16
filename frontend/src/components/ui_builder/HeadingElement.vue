<template>
  <div class="el-text">
    <h1>Heading</h1>
  </div>
</template>

<script setup lang="ts">
import { IBaseElementProps } from './BaseElement';

export interface IHeadingElementProps extends IBaseElementProps {
  editable: boolean;
}

defineProps<IHeadingElementProps>();
</script>

<style lang="scss" scoped>
h1 {
  color: white;
  font-size: 2em;
  padding: 0;
  margin: 0;
}
</style>

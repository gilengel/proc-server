<template>
  <div class="el-text">
    <component :is="type">Heading</component>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IBaseElementProps, getValueOfAttribute } from '../BaseElement';

export interface IHeadingElementProps extends IBaseElementProps {
  editable: boolean;
}

const props = defineProps<IHeadingElementProps>();

const type = computed(() => {
  return getValueOfAttribute('type', props.model);
});
</script>

<style lang="scss" scoped>
h1 {
  color: white;
  font-size: 2em;
  padding: 0;
  margin: 0;
}
</style>

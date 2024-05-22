<template>
  <svg data-testid="connection">
    <path :d="path"></path>
  </svg>
</template>

<script lang="ts">
export type FlowConnectionProps = {
  data: unknown;
  start: unknown;
  end: unknown;
  path?: string;
};
</script>
<script setup lang="ts">
defineProps<FlowConnectionProps>();
</script>

<style scoped lang="scss">
svg {
  overflow: visible !important;
  position: absolute;
  pointer-events: none;
  width: 9999px;
  height: 9999px;
  path {
    fill: none;
    stroke-width: 5px;
    stroke: white;
    pointer-events: auto;
  }
}
</style>

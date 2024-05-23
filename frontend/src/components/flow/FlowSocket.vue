<template>
  <div :class="['socket', 'dark']"></div>
</template>

<script setup lang="ts">
export interface ISocketProps {
  data: {
    name: string;
  };
}

defineProps<ISocketProps>();
</script>

<style lang="scss" scoped>
$socket-size: 16px;
$socket-margin: 10px;
.socket {
  display: inline-block;
  cursor: pointer;
  border-radius: $socket-size/2.0;
  width: $socket-size;
  height: $socket-size;
  margin: $socket-margin !important;
  vertical-align: middle;
  background: transparent;
  position: relative;

  z-index: 2;
  &.used {
    background: white;
  }

  &:hover {
    border: 2px solid #777;
  }
  &.multiple {
    border-color: yellow;
  }
}

.light {
  border: solid 2px darken(#22252b, 5%);
}
.dark {
  border: solid 2px white;
}
</style>

<template>
  <div :class="['socket', type, socket.name, used ? 'used' : '', $q.dark.isActive ? 'dark' : 'light']">
    <q-tooltip>{{socket.name}} | {{socket.hint}}</q-tooltip>
  </div>
</template>

<script lang="ts">
import { Socket as ReteSocket } from "rete";

import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class Socket extends Vue {
  @Prop()
  socket!: ReteSocket;

  @Prop()
  type!: string;

  @Prop()
  used!: boolean;
}
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
  &:after {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    top: $socket-size/4-1px;
    left: $socket-size;
    display: inline-block;
    border-style: solid;
    border-width: $socket-size/4 0 $socket-size/4 $socket-size/6;
    border-color: transparent transparent transparent white;
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

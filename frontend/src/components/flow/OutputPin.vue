<template>
  <div class="row">
    <div class="output-title col">{{ pin.name }}</div>

    <Socket
      v-socket:input="pin"
      type="output"
      :socket="pin.socket"
      :used="pin.connections.length > 0"
      class="col-12 col-md-auto"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { Output } from "rete";
import Socket from "./Socket.vue";
import Mixin from "src/components/flow/plugins/render/Mixin";

@Component({
  components: {
    Socket,
  },
})
export default class OutputPin extends Mixin {
  @Prop() readonly pin!: Output;
}
</script>

<style lang="scss" scoped>
.row {
  width: 100%;
  justify-content: space-between;
}
.output-title {
  display: flex;
  align-items: center;

  padding-left: 1em;
}
</style>

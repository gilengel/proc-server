<template>
  <div class="row">
    <Socket
      v-socket:input="pin"
      type="input"
      :socket="pin.socket"
      :used="pin.connections.length > 0"
      class="col-12 col-md-auto"
    />

    <div class="col input-title" v-show="!pin.showControl()">
      {{ pin.name }}
    </div>

    <div
      class="col input-control"
      v-show="pin.showControl()"
      v-control="pin.control"
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { Input } from "rete";
import Socket from "./Socket.vue";
import Mixin from "src/components/flow/plugins/render/Mixin";

@Component({
  components: {
    Socket,
  },
})
export default class InputPin extends Mixin {
  @Prop() readonly pin!: Input;
}
</script>

<style lang="scss" scoped>

.input-title {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 1em;
}
</style>

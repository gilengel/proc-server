<template>
  <div class="linked-control column q-gutter-md">
    <div class="col">
      <q-input v-model="variableName" label="Name" stack-label dense />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import VueFlowControl from "./FlowControl";

@Component
export default class NameControl extends VueFlowControl {
  variableName: string = "";
}
</script>

<style lang="scss" scoped>
</style>

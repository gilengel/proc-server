<template>
  <div class="linked-control column q-gutter-md">
    <div class="row">
      <q-input
        class="col"
        label="Name"
        stack-label
        dense
        :value="scope.value.identifier"
        @input="changeIdentifier($event)"
      />
      <q-select
        class="col"
        filled
        :value="scope.value.type"
        :options="filterOptions"
        dense
        color="primary"
        @input="changeType($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import VueFlowControl from "./FlowControl";

import { ElementAttributeType } from "src/models/Grid";

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

@Component
export default class TypeControl extends VueFlowControl {
  variableName: string = "";

  newFilter: string = "String";

  model: string = "";

  scope = {
    value: {
      identifier: '',
      type: ElementAttributeType.String
    },
    changeIdentifier: this.changeIdentifier.bind(this)
  }

  get filterOptions() {
    let a = [];
    for (const value of enumKeys(ElementAttributeType)) {
      a.push(ElementAttributeType[value]);
    }

    return a;
  }

  get options() {
    let result = [];
    for (const transform in ElementAttributeType) {
      result.push(transform);
    }

    return result;
  }

  changeIdentifier(e: any) {
    this.scope.value.identifier = e
    this.update()
  }

  changeType(e: any) {
    this.scope.value.type = e
    this.update()
  }

  update() {
    this.putData(this.propertyKey, this.scope.value)
    this.emitter?.trigger('process')
  }
}
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="linked-control column q-gutter-md">
    <div class="row" style="gap: 1em; padding-left: 1em; padding-right: 1em">
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

<script setup lang="ts">
import { ElementAttributeType } from 'src/models/Grid';
import { ControlProps } from './ControlProps';

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

let props = defineProps<ControlProps>();

let scope = {
  value: {
    identifier: '',
    type: ElementAttributeType.String,
  },
  changeIdentifier: changeIdentifier.bind(this),
};

function filterOptions() {
  let a = [];
  for (const value of enumKeys(ElementAttributeType)) {
    a.push(ElementAttributeType[value]);
  }

  return a;
}
/*
get options() {
  let result = [];
  for (const transform in ElementAttributeType) {
    result.push(transform);
  }

  return result;
}
*/

function changeIdentifier(e: string) {
  scope.value.identifier = e;
  update();
}

function changeType(e: ElementAttributeType) {
  scope.value.type = e;
  update();
}

function update() {
  props.putData(props.propertyKey as string, scope.value);
  props.emitter?.trigger('process');
}
</script>

<style scoped></style>

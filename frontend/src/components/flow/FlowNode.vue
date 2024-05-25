<template>
  <div class="node">
    <h1 class="title q-pa-sm">
      <b>{{ data.label }}</b> {{ variableName }}
    </h1>

    <div class="row">
      <div class="col col-4 in">
        <div
          class="input-socket"
          v-for="[key, input] in inputs"
          :key="key + seed"
        >
          <ReteRef
            :data="{
              type: 'socket',
              side: 'input',
              key,
              nodeId: data.id,
              payload: input.socket,
            }"
            :emit="emit"
          />
          {{ input.socket.name }}
        </div>
      </div>
      <div class="col col-4">CONTROL</div>
      <div class="col col-4 out">
        <div
          class="output-socket"
          v-for="[key, output] in outputs"
          :key="key + seed"
        >
          <ReteRef
            :data="{
              type: 'socket',
              side: 'output',
              key: key,
              nodeId: data.id,
              payload: output.socket,
            }"
            :emit="emit"
          />
          {{ output.socket.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export type FlowConnector = {
  id: string;
  label?: string;
  multipleConnections?: boolean;
  socket: {
    name: string;
  };
};

export type FlowNodeInput =
  | FlowConnector
  | {
      control: Control | null;
      showControl: boolean;
      socket: {
        name: string;
      };
    };

export type FlowNodeOutput = FlowConnector;
</script>

<script setup lang="ts">
import { Ref as ReteRef } from 'rete-vue-plugin';
import { Control } from 'rete/_types/presets/classic';
import { useComputedAttributeModel } from 'src/composables/useComputedAttributeModel';

import { Element } from 'src/models/Grid';

import { ComputedRef, computed } from 'vue';

export type FlowNodeProps = {
  data: Element;

  emit: () => void;

  seed?: number;
};

const props = defineProps<FlowNodeProps>();

const variableName = useComputedAttributeModel('variable', props.data);

// TODO: proper typing without first cast to unknown
const inputs: ComputedRef<[string, FlowNodeInput][]> = computed(() => {
  return Object.entries(props.data.inputs) as [string, unknown][] as [
    string,
    FlowNodeInput,
  ][];
});

const outputs: ComputedRef<[string, FlowNodeOutput][]> = computed(() => {
  return Object.entries(props.data.outputs) as [string, unknown][] as [
    string,
    FlowNodeOutput,
  ][];
});
</script>

<style lang="scss">
$node-color: lighten($dark-page, 5%);
$color-active: darken($node-color, 5%);
$title-light: rgba(0, 255, 0, 0.5);
$title-light-transparent: rgba(0, 255, 0, 0);
$group-color: rgba(15, 80, 255, 0.2);
$group-handler-size: 40px;
$group-handler-offset: -10px;
$context-menu-round: 7px;
$socket-size: 10px;
$socket-margin: 10px;

.node {
  min-width: 300px;
  min-height: 200px;
  background: lighten($dark-page, 2%);

  box-shadow: 2px 2px 4px darken($dark-page, 3%);

  > h1 {
    font-size: 1.2em;
    margin: 0;
    padding: 1em;
    line-height: 2em;
  }
}

.input-socket {
  display: flex;
  align-items: center;
}

.output-socket {
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.in {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.out {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>

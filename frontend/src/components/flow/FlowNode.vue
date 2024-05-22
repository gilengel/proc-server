<template>
  <div class="node">
    <h1 class="title q-pa-sm">{{ data.label }}</h1>

    <div class="row">
      <div class="col col-4 in">
        <div
          class="input-socket"
          v-for="[key, input] in inputs"
          :key="key + seed"
        >
          <Ref
            :data="{
              type: 'socket',
              side: 'input',
              key,
              nodeId: data.id,
              payload: input.socket,
            }"
            :emit="emit"
            data-testid="input-socket"
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
          :data-testid="'output-' + key"
        >
          <Ref
            class="output-socket"
            :data="{
              type: 'socket',
              side: 'output',
              key: key,
              nodeId: data.id,
              payload: output.socket,
            }"
            :emit="emit"
            data-testid="output-socket"
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

export type FlowNodeData = {
  label: string;

  inputs: { key: string; input: FlowNodeInput }[];
  outputs: { key: string; input: FlowNodeOutput }[];
  controls: { key: string; control: unknown }[];
  id: string;
};
</script>

<script setup lang="ts">
//import { Control } from 'rete/_types/presets/classic';

//import { ClassicPreset } from 'rete';
import { Ref } from 'rete-vue-plugin';
import { Control } from 'rete/_types/presets/classic';

import { ComputedRef, computed } from 'vue';
//import { computed } from 'vue';

export type FlowNodeProps = {
  data: FlowNodeData;

  emit: () => void;

  seed?: number;
};

const props = defineProps<FlowNodeProps>();

// TODO: proper typing without first cast to unknown
const inputs: ComputedRef<[string, FlowNodeInput][]> = computed(() => {
  return Object.entries(props.data.inputs) as [string, unknown][] as [
    string,
    FlowNodeInput,
  ][];
});

const outputs: ComputedRef<[string, FlowNodeOutput][]> = computed(() => {
  return Object.entries(props.data.inputs) as [string, unknown][] as [
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

/*
.output-container {
  justify-content: space-between;
}

.selected::before {
  display: block;
  content: ' ';
  position: absolute;
  z-index: -1;
  border: solid 2px orange;
  border-radius: 2px;

  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
}

.node {
  background: $node-color;
  cursor: pointer;
  height: auto;
  box-sizing: content-box;

  min-width: 200px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  user-select: none;

  .row {
    background-color: red;
  }


  .content {
    display: flex;
    flex-grow: 2;
    padding-top: 20px;
    padding-bottom: 8px;
    //

    .node-column {
      align-items: center;
      align-content: space-between;

      .control {
        padding-left: 8px;
        padding-right: 8px;
      }
    }
  }
}

.input-container,
.output-container {
  padding-right: 6px;
  display: flex;
  align-items: center;

  color: white;
}

.node:hover {
  background: $node-color;
}
.node:hover.active {
  background: $color-active;
  border: 1px solid #ffd252;
}

.title {
  color: white;

  justify-content: space-between;
  align-items: center;

  text-transform: capitalize;
}

.column:not(:last-child) {
  padding-right: 20px;
}

.inputs,
.outputs {
  text-align: left;
}

.outputs {
  align-items: flex-end;
  text-align: right;
}

.socket {
  width: $socket-size !important;
  height: $socket-size !important;
}

.socket::after {
  visibility: hidden;
}
*/
</style>

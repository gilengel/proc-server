<template>
  <div :class="[data.selected, 'node', 'shadow-4']">
    <div class="title q-pa-sm">{{ data.label }}</div>
    <div class="controls q-pl-sm q-pr-sm">
      <Ref
        class="control"
        v-for="[key, control] in controls()"
        :key="key + seed"
        :emit="emit"
        :data="{ type: 'control', payload: control }"
        :data-testid="'control-' + key"
      />
    </div>
    <div class="pins row">
      <div class="col-12 col-md-6 q-pt-sm q-pb-sm">
        <div
          v-for="input in inputs()"
          :key="input.name"
          class="row input-container"
        >
          <div
            class="input"
            v-for="[key, input] in inputs()"
            :key="key + props.seed"
            :data-testid="'input-' + key"
          >
            <Ref
              class="input-socket"
              :emit="emit"
              :data="{
                type: 'socket',
                side: 'input',
                key: key,
                nodeId: data.id,
                payload: input.socket,
              }"
              data-testid="input-socket"
            />
            <div
              class="input-title"
              v-show="!input.control || !input.showControl"
              data-testid="input-title"
            >
              {{ input.label }}
            </div>
            <Ref
              class="input-control"
              v-show="input.control && input.showControl"
              :emit="emit"
              :data="{ type: 'control', payload: input.control }"
              data-testid="input-control"
            />
          </div>
          <!--
        <InputPin
            :pin="input"
            :bindSocket="bindSocket"
            :bindControl="bindControl"
          />
      -->
        </div>
      </div>
      <div class="col-12 col-md-6 q-pt-sm q-pb-sm">
        <div
          v-for="output in outputs()"
          :key="output.name"
          class="row output-container"
        >
          <div
            class="output"
            v-for="[key, output] in outputs()"
            :key="key + seed"
            :data-testid="'output-' + key"
          >
            <div class="output-title" data-testid="output-title">
              {{ output.label }}
            </div>
            <Ref
              class="output-socket"
              :emit="emit"
              :data="{
                type: 'socket',
                side: 'output',
                key: key,
                nodeId: data.id,
                payload: output.socket,
              }"
              data-testid="output-socket"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'rete-vue-plugin';

export interface NodeProps {
  data: {
    id: unknown;
    seed: unknown;
    selected: boolean;
    label: string;
    inputs: unknown[];
    outputs: unknown[];
    controls: unknown[];
  };

  seed: unknown;
  emit: unknown;
}

const props = defineProps<NodeProps>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortByIndex(entries: any[]) {
  entries.sort((a, b) => {
    const ai = (a[1] && a[1].index) || 0;
    const bi = (b[1] && b[1].index) || 0;

    return ai - bi;
  });
  return entries;
}

function inputs() {
  return sortByIndex(Object.entries(props.data.inputs));
}

function outputs() {
  return sortByIndex(Object.entries(props.data.outputs));
}

function controls() {
  if (!props.data.controls) {
    return [];
  }

  return sortByIndex(Object.entries(props.data.controls));
}
</script>

<style scoped lang="scss">
$node-color: $primary; //rgba(35, 35, 35, 0.7);
$color-active: darken($node-color, 5%);
$title-light: rgba(0, 255, 0, 0.5);
$title-light-transparent: rgba(0, 255, 0, 0);
$group-color: rgba(15, 80, 255, 0.2);
$group-handler-size: 40px;
$group-handler-offset: -10px;
$context-menu-round: 7px;
$socket-size: 10px;
$socket-margin: 10px;

.output-container {
  justify-content: space-between;
}
/*
.selected::before {
  display: block;
  content: " ";
  position: absolute;
  z-index: -1;
  border: solid 2px orange;
  border-radius: 2px;

  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  //right: 0;
}

.node {
  color: white;

  .title {
    border: solid 1px white;
  }

  .pin-container {
    border: solid 1px green;
  }
}

.node {
  background: $node-color;
  cursor: pointer;
  height: auto;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -khtml-user-select: none;
  user-select: none;

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

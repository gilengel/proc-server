<template>
  <div class="layout-col" v-bind:class="{ active: !linkModeActive }">
    <div class="actions" v-if="!linkModeActive && editable">
      <q-btn dark flat round color="white" icon="las la-plus">
        <q-menu dark>
          <q-list style="min-width: 100px">
            <template v-for="element in allowedElements" :key="element">
              <q-item clickable v-close-popup>
                <q-item-section>{{ element }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        :disable="splitDisabled"
        dark
        flat
        round
        color="white"
        icon="las la-columns"
        @click="gridModuleStore.splitColumn(rowIndex, columnIndex)"
      />
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-trash-alt"
        :disable="model.width === 12"
        @click="gridModuleStore.deleteColumn(rowIndex, columnIndex)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Column } from '../../models/Grid';
import { useGridModuleStore } from '../../stores/gridModule';
import { colValidator } from './common';

const gridModuleStore = useGridModuleStore();

defineProps({
  rowIndex: {
    type: Number,
    required: true,
  },

  columnIndex: {
    type: Number,
    default: 2,
    required: true,
    validator: colValidator,
  },
  linkModeActive: Boolean,

  model: {
    type: Object as () => Column,
    required: true,
  },

  editable: {
    type: Boolean,
    required: false,
    default: true,
  },

  splitDisabled: Boolean,
});

const allowedElements = ['Button', 'Text', 'Heading'];
</script>

<style lang="scss" scoped>
.layout-col {
  position: relative;
  border: 1px solid $border;
  border-left: none;
  text-align: center;
  min-height: 128px;

  padding: 1em;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-content: stretch;
  justify-content: center;

  > div {
    width: 100%;
    padding: 1em;
  }

  > .actions {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 3;
    width: auto;

    transform: translate(-50%, -2px);

    padding: 0;
    background: $primary;
    visibility: collapse;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.active:hover {
  outline: solid 2px $primary;
}
/*
.layout-col:hover::after {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    content: ' ';
    filter: blur(4px);
    background: salmon;
}
*/
.layout-col:hover > .actions {
  visibility: visible;
}

.layout-col:first-of-type {
  border-left: 1px solid $border;
}
</style>

<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Connection</h1>
    <div class="row q-pa-sm">
      <div class="col-12">
        <draggable
          class="q-list q-list--bordered q-list--separator q-list--dark"
          tag="div"
          v-model="list"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
        >
          <transition-group
            type="transition"
            :name="!drag ? 'flip-list' : null"
          >
            <q-item
              clickable
              v-ripple
              class="list-group-item"
              v-for="(element, index) in list"
              :key="index"
            >
              <q-item-section avatar>
                <q-avatar size="md" color="primary" text-color="white">
                  {{ index }}
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <i
                  :class="
                    element.fixed
                      ? 'fa fa-anchor'
                      : 'glyphicon glyphicon-pushpin'
                  "
                  @click="element.fixed = !element.fixed"
                  aria-hidden="true"
                ></i>
                {{ element.name }}
              </q-item-section>
              <q-item-section avatar>
                <q-btn
                  class="gt-xs"
                  flat
                  dense
                  round
                  icon="las la-trash-alt"
                  @click="deleteFilter(index)"
                />
              </q-item-section>
            </q-item>
          </transition-group>
        </draggable>
      </div>
    </div>

    <div class="row q-pa-sm">
      <div class="col-8">
        <q-select
          color="primary"
          dark
          outlined
          v-model="newFilter"
          :options="filterOptions"
          dense
        >
        </q-select>
      </div>
      <div class="col-4">
        <q-btn color="primary" label="Add Filter" @click="addFilter" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import HeadingElement from "./TextElement.vue";
import draggable from "vuedraggable";

import { StringTransform } from "../../models/String";
import BaseElement from "./BaseElement.vue";
import { ElementConnection } from "src/models/Grid";
import { Action } from "vuex-class";

function enumKeys<O extends object, K extends keyof O = keyof O>(obj: O): K[] {
  return Object.keys(obj).filter((k) => Number.isNaN(+k)) as K[];
}

interface ListItem {
  name: string;
  order: number;
  fixed: boolean;
}

@Component({
  name: "ConnectionOptions",

  components: {
    draggable,
  },
})
export default class ConnectionOptions extends BaseElement {

  @Action("addConnectionTransformation")
  addConnectionTransformation!: (param: { connection: ElementConnection, transformation: StringTransform }) => void

  @Action("setConnectionTransformations")
  setConnectionTransformations!: (param: { connection: ElementConnection, transformations: Array<StringTransform> }) => void

  @Action("removeConnectionTransformation")
  removeConnectionTransformation!: (param: { connection: ElementConnection, index: number }) => void

  drag = false;

  newFilter = StringTransform.ToUppercase;

  //list: Array<ListItem> = [];

  get list(): Array<ListItem> {
    const connection = this.model as ElementConnection;

    if (!connection.transform) {
      return [];
    }

    console.log(connection.transform);
    return connection.transform.map((transform, index) => {
      return { name: transform, order: index, fixed: false };
    });
  }

  set list(a: Array<ListItem>) {
    const transformations = a.map((transform) => {
      return transform.name
    });

    const connection = this.model as ElementConnection;
    this.setConnectionTransformations({ connection: connection, transformations: transformations})
  }

  get filterOptions() {
    let a = [];
    for (const value of enumKeys(StringTransform)) {
      a.push(StringTransform[value]);
    }

    return a;
  }

  get options() {
    let result = [];
    for (const transform in StringTransform) {
      result.push(transform);
    }

    return result;
  }

  get dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }

  addFilter() {
    this.addConnectionTransformation({ connection: this.model, transformation: this.newFilter })
  }

  deleteFilter(index: number) {
    this.removeConnectionTransformation({ connection: this.model, index: index})
  }

  sort() {
    this.list = this.list.sort((a, b) => a.order - b.order);
  }
}
</script>

<style lang="scss" scoped>
.option-column {
  height: 100%;
}
.text-subtitle1 {
  color: white;
}

.row {
  display: flex;
  align-items: center;

  .col-4 {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

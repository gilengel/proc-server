<template>
  <Widget
    title="List"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <div class="q-pa-md q-gutter-md">
      <q-list v-for="item in model.list" :key="item">
        <q-item>
          <q-item-label>{{ item }}</q-item-label>
        </q-item>
      </q-list>
      <q-input outlined v-model="temporaryItem" @keyup.enter="addToList" />
    </div>
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import Vue from "vue";
import Component from "vue-class-component";
import { Getter, Action } from "vuex-class";

import IModel from "../store/Model";

interface Todo {
  checked: boolean;
  text: string;
}

@Component({
  name: "ListWidget",
})
export default class ListWidget extends Widget {
  @Getter("model")
  getModel!: (uuid: string) => {};

  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  get model() {
    let storeModel = this.getModel(this.uuid);

    if (storeModel === undefined) {
      storeModel = {
        list: [],
      };
    }

    return storeModel;
  }

  temporaryItem = "Foo";

  addToList() {
    if (this.temporaryItem === "") {
      return;
    }

    const model = this.model;
    model.list.push(this.temporaryItem);
    this.temporaryItem = "";

    this.updateModel({
      uuid: this.uuid,
      model,
    });
  }
}
</script>

<style lang="scss">
</style>

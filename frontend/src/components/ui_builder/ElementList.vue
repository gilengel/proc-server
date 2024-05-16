<template>
  <div class="q-pa-md">
    <q-input dark outlined bottom-slots v-model="text" dense>
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <draggable
      class="q-list q-list--bordered q-list--separator q-list--dark"
      tag="div"
      v-model="list"
      v-bind="dragOptions"
      @start="onStart"
      @end="onEnd"
      :move="onMoveCallback"
      :group="{ name: 'widget', pull: 'clone', put: false }"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null">
        <q-item
          clickable
          v-ripple
          class="list-group-item"
          v-for="(element, index) in list"
          :key="index"
        >
          <q-item-section>
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            {{ element.name }}
          </q-item-section>
        </q-item>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import draggable from "vuedraggable";

interface ListItem {
  name: string;
  order: number;
  fixed: boolean;
}

@Component({
  name: "ElementList",

  components: {
    draggable,
  },
})
export default class ElementList extends Vue {
  text = "";
  elements = ["Heading", "Text", "Button", "Map"];

  drag = false;

  get list(): Array<ListItem> {
    return this.elements.map((transform, index) => {
      return { name: transform, order: index, fixed: false };
    });
  }

  set list(a: Array<ListItem>) {
    const list = a.map((transform) => {
      return transform.name;
    });

    this.elements = list;
  }

  get dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }

  onStart() {
    this.$emit('startDragging')
  }

  onEnd() {
    this.$emit('stopDragging')
  }
  onMoveCallback(evt: any, originalEvent: any): boolean {
    const targetClassList = evt.related.classList as DOMTokenList;

    if (targetClassList.contains("layout-row")) {
      //return false;
    }

    console.log(evt.related)

    return true;
    // return false; — for cancel
  }
}
</script>

<style lang="scss" scoped>
</style>

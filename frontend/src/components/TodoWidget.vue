<template>
  <Widget
    title="Todo"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <div class="q-pa-md q-gutter-md">
      <q-list v-for="todo in todos" :key="todo.text">
        <q-item>
          <q-item-section>
            <q-item-label>{{ todo.text }}</q-item-label>
          </q-item-section>

          <q-item-section top side>
            <q-checkbox v-model="todo.checked" />
          </q-item-section>
        </q-item>
      </q-list>

      <div class="toolbar">
        <q-btn round color="primary" icon="las la-plus" />
      </div>
    </div>
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import Vue from "vue";
import Component from "vue-class-component";

interface Todo {
  checked: boolean;
  text: string;
}

@Component({
  name: "TodoWidget",

  components: {
    Widget,
  },
})
export default class TodoWidget extends Widget {
  todos: Todo[] = [
    { text: "Read a book", checked: false },
    { text: "Try not to fall asleep", checked: false },
    { text: "Watch a movie", checked: false },
    { text: "Go for a walk", checked: false },
  ];
}
</script>

<style lang="scss">
.toolbar {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 6px;

  .q-btn {
    margin: 0;
    transform: translateY(-50%);
    position: relative;
    display: block;
  }

  $margin: 8px;
  .q-btn::before {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: solid $margin $dark-page;
    height: calc(100% + #{$margin} * 2);
    top: -$margin;
    left: -$margin;
    width: calc(100% + #{$margin} * 2);
  }
}
</style>

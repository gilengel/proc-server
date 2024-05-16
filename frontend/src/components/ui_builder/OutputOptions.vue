<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Output</h1>

    <NestedDraggable :tasks="list" />
  </div>
</template>

<script lang="ts">
import TextElement from "./TextElement.vue";
import { Component } from "vue-property-decorator";
import draggable from "vuedraggable";
import NestedDraggable from "../NestedDraggable.vue";

@Component({
  name: "OutputOptions",

  components: {
    NestedDraggable,
    draggable
  },
})
export default class OutputOptions extends TextElement {
  tasks = {
    required: true,
    type: Array,
  };

  list = [
    {
      name: "task 1",
      tasks: [
        {
          name: "task 2",
          tasks: [],
        },
      ],
    },
    {
      name: "task 3",
      tasks: [
        {
          name: "task 4",
          tasks: [],
        },
      ],
    },
    {
      name: "task 5",
      tasks: [],
    },
  ];
}
</script>

<style lang="scss" scoped>
.connector {
  width: 32px;
  height: 32px;

  border: solid 2px $primary;
  border-radius: 2px;
}

.option-column {
  padding-left: 1em;
  padding-right: 1em;
  color: white;

  .preview {
    display: flex;
    justify-content: center;
    align-items: center;

    padding: 1em;
  }
}
.q-icon {
  font-size: 3em;
  margin: 0.3rem;
}
</style>

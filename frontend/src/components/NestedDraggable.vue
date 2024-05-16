<template>
  <!--
  <ul>
    <li>
      Animals
      <ul>
        <li>Birds</li>
        <li>
          Mammals
          <ul>
            <li>Elephant</li>
            <li>Mouse</li>
          </ul>
        </li>
        <li>Reptiles</li>
      </ul>
    </li>
    <li>
      Plants
      <ul>
        <li>
          Flowers
          <ul>
            <li>Rose</li>
            <li>Tulip</li>
          </ul>
        </li>
        <li>Trees</li>
      </ul>
    </li>
  </ul>
  -->
  <draggable class="dragArea" tag="ul" :list="tasks" :group="{ name: 'g1' }">
    <li v-for="el in tasks" :key="el.name">
      <p>{{ el.name }}</p>
      <NestedDraggable :tasks="el.tasks" />
    </li>
  </draggable>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import draggable from "vuedraggable";

@Component({
  components: {
    draggable,
  },
})
export default class NestedDraggable extends Vue {
  @Prop()
  tasks: any;
}
</script>
<style lang="scss" scoped>
$height: 2em;
ul,
ul ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
ul ul {
  margin-left: 10px;
}

ul {
  li {
    margin: 0;
    padding: 0 7px;
    line-height: 20px;
    border-left: 1px solid rgb(100, 100, 100);

    p {
        margin: 0;
    }
  }
}

ul li:last-child {
  border-left: none;
}
ul li:before {
  position: relative;
  top: -0.3em;
  height: $height;
  width: 20px;
  color: white;
  border-bottom: 1px solid rgb(100, 100, 100);
  content: "";
  display: inline-block;
  left: -7px;
}
ul li:last-child:before {
  border-left: 1px solid rgb(100, 100, 100);
}
</style>

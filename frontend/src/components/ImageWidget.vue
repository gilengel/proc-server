<template>
  <Widget
    title="Image"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <q-img src="https://placeimg.com/500/300/nature" :ratio="1" />
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import Component from "vue-class-component";

@Component({
  name: "ImageWidget",
})
export default class ImageWidget extends Widget {}
</script>

<style lang="scss">
</style>

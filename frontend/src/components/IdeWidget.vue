<template>
  <Widget title="Image">
    <iframe src="http://localhost:3000/#/home/gil/rust_webassembly/wasm-game-of-life" />
  </Widget>
</template>

<script lang="ts">
import Widget from './Widget.vue'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
  name: 'IdeWidget',

  components: {
    Widget
  }
})
export default class ImageWidget extends Vue {}
</script>

<style lang="scss">
  iframe {
    border: none;
    outline: none;
    width: 100%;
    height: 800px;
  }
</style>

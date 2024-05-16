<template>
  <div class="el-text">
    <h1>Heading</h1>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue';

@Component({
  name: 'TextElement'
})
export default class TextElement extends BaseElement {
  @Prop({default: false}) editable!: boolean;
}
</script>

<style lang="scss" scoped>
h1 {
    color: white;
    font-size: 2em;
    padding: 0;
    margin: 0;
}
</style>

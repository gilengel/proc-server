<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Heading</h1>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import HeadingElement from './TextElement.vue'

@Component({
  name: 'HeadingOptions'
})
export default class HeadingOptions extends HeadingElement {

}
</script>

<style lang="scss">
</style>

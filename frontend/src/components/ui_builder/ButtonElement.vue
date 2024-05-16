<template>
  <div>
    <q-btn
      text-color="white"
      :flat="!isHighlighted"
      :label="label"
      :icon="previewIcon"
      :type="type"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue';

@Component({
  name: 'ButtonElement'
})
export default class ButtonElement extends BaseElement {

  get type(): String {
    return this.getValueOfAttribute('type')
  }

  get label(): String {
    return this.getValueOfAttribute('label')
  }

  get isHighlighted(): boolean {
    return this.getValueOfAttribute('isHighlighted')
  }

  get icon(){
    return this.getValueOfAttribute('icon')
  }

  get hasIcon(){
    return this.getValueOfAttribute('hasIcon')
  }

  get previewIcon () {
    let icon

    if (this.hasIcon && this.icon !== '') {
      icon = this.icon
    }

    return icon
  }
}
</script>

<style lang="scss" scoped>
div{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>

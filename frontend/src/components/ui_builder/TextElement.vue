<template>
  <div class="el-text">
    <template v-if="withLabel">
    <q-input v-if="editable"
      dark
      placeholder="Label"
      v-model="label"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
    <label v-else>
      {{label}}
    </label>
    </template>
    <q-input
      dark
      placeholder="Heading"
      :type="type"
      :readonly="!editable"
      v-model="valueInput"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch } from 'vue-property-decorator'
import BaseElement from './BaseElement.vue';
import { Element } from '../../models/Grid';
import { applyTransformations } from '../../models/String'

@Component({
  name: 'TextElement'
})
export default class TextElement extends BaseElement {
  @Prop({default: false}) editable!: boolean;

  // Used if the text element is not connected to a parent element
  private tempValue: string = '';

  get valueInput() {
    let result = '';
    // use always connected value first
    const element = this.model as Element;

    if(element.inputs && element.inputs.length > 0 && element.inputs[0].connection) {
      result = applyTransformations(element.inputs[0].connection.value, element.inputs[0].connection.transform)
    }

    if(result.length == 0) {
      result = this.tempValue
    }

    return result;
  }

  @Watch('valueInput')
  onValueInputChanged(val: string, oldVal: string) {
    this.setOutputConnectionValue(val);
    this.tempValue = val;
  }

  set valueInput(val: string) {
    this.setOutputConnectionValue(val);
    this.tempValue = val;
  }

  setOutputConnectionValue(value: string) {
    // next inform all connected elements via reactive connection value
    const element = this.model as Element;
    if(!element.outputs) {
      return
    }

    for(const output of element.outputs) {
      if(output.connection) {

        this.setConnectionValue({ connection : output.connection, value: value })
      }
    }
  }

  get withLabel(): boolean {
      return this.getValueOfAttribute('withLabel')
  }

  set withLabel(value: boolean) {
      this.setValueOfAttribute('withLabel', value)
  }

  get label(): string {
    return this.getValueOfAttribute('label')
  }

  get type(): String {
    return this.getValueOfAttribute('type')
  }

  get variable(): String {
    return this.getValueOfAttribute('variable')
  }

  get isConnected(): boolean {
    const element = this.model as Element
    const connectedOutputPin = element.outputs?.find(pin => pin.connection)
    const connectedInputPin = element.inputs?.find(pin => pin.connection)

    return connectedOutputPin !== undefined || connectedInputPin !== undefined;
  }

  get classList(): Array<string> {
    return this.getValueOfAttribute('classList')
  }

  hover = false
}
</script>

<style lang="scss">
.el-text {
    z-index: 2;

    user-select: none;
}
.el-text ::after {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background: transparent;

    content: ' ';
}
</style>

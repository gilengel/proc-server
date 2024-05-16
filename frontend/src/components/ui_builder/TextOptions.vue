<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Text</h1>
      <q-toggle
        v-model="withLabel"
        label="With Label"
        color="primary"
      />

    <q-input
      dark
      standout
      v-model="variableInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-input
      dark
      standout
      v-model="labelInput"
      label="Variable Identifier"
      stack-label
      style="margin-bottom: 1em"
    />

    <q-option-group
      v-model="typeGroup"
      :options="typeOptions"
      dark
      color="primary"
    />
  </div>
</template>

<script lang="ts">
import TextElement from './TextElement.vue'
import { Component, Watch } from 'vue-property-decorator'

export enum TextType {
  Password = 'password',
  Email = 'email',
  Phone = 'tel',
  URL = 'url',
  Time = 'time',
  Date = 'date',
  Text = 'text'
}

@Component({
  name: 'TextOptions'
})
export default class TextOptions extends TextElement {
  identifier = 'text'

  typeOptions = [
    { label: 'Password', value: TextType.Password },
    { label: 'Email', value: TextType.Email },
    { label: 'Phone', value: TextType.Phone },
    { label: 'URL', value: TextType.URL },
    { label: 'Time', value: TextType.Time },
    { label: 'Date', value: TextType.Date },
    { label: 'Text', value: TextType.Text }
  ]

  typeGroup : String = 'text'

  mounted() {
    const type = this.typeInput;

    if(type) {
      this.typeGroup = type;
    }
  }

  set typeInput(value: String) {
    this.setValueOfAttribute("label", value);
  }

  get typeInput() : String{
    return this.type;
  }

  @Watch('typeGroup')
  onChildChanged(val: String, oldVal: String) {
    this.setValueOfAttribute("type", val);
  }


  set labelInput(value: string) {
    this.setValueOfAttribute("label", value);
  }

  get labelInput() {
    return this.getValueOfAttribute("label");
  }


  set variableInput(value: string) {
    this.setValueOfAttribute("variable", value);
  }

  get variableInput() {
    return this.getValueOfAttribute("variable");
  }
}
</script>

<style lang="scss" scoped>
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

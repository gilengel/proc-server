<template>
  <div class="el-text">
    <template v-if="withLabel">
      <q-input
        v-if="editable"
        dark
        placeholder="Label"
        v-model="label"
        @mouseover="hover = true"
        @mouseleave="hover = false"
      />
      <label v-else>
        {{ label }}
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

<script setup lang="ts">
export interface ITextElementProps extends IBaseElementProps {
  editable: boolean;
}
import { Ref, computed, ref } from 'vue';
import { applyTransformations } from '../../models/String';
import { IBaseElementProps, getValueOfAttribute } from './BaseElement';

const props = defineProps<ITextElementProps>();

function valueInput() {
  let result = '';
  // use always connected value first

  if (
    props.model.inputs &&
    props.model.inputs.length > 0 &&
    props.model.inputs[0].connection
  ) {
    result = applyTransformations(
      props.model.inputs[0].connection.value,
      props.model.inputs[0].connection.transform,
    );
  }

  if (result.length == 0) {
    result = this.tempValue;
  }

  return result;
}

const withLabel = computed(() => getValueOfAttribute('withLabel', props));
const label = computed(() => getValueOfAttribute('label', props));
const type = computed(() => getValueOfAttribute('type', props));
//const variable = computed(() => getValueOfAttribute('variable', props));

//const isConnected = computed(() => {
//  const connectedOutputPin = props.model.outputs?.find((pin) => pin.connection);
//  const connectedInputPin = props.model.inputs?.find((pin) => pin.connection);
//
//  return connectedOutputPin !== undefined || connectedInputPin !== undefined;
//});

//const classList = computed(() => getValueOfAttribute('classList', props));

const hover: Ref<boolean> = ref(false);
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

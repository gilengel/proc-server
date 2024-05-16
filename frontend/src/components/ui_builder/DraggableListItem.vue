<template>
  <q-item draggable>
    <q-item-section avatar>
      <q-icon color="white" :name="element.icon" />
    </q-item-section>

    <q-item-section>{{ element.label }}</q-item-section>
  </q-item>
</template>

<script lang='ts'>

import { Component, Prop } from "vue-property-decorator";
import { mixins } from 'vue-class-component'
import { Drag } from '../../mixins/Drag'

@Component({
  name: "DraggableListItem",
})
export default class DraggableListItem extends mixins(Drag)  {
  @Prop() element!: null;
}
</script>

<style lang='scss'>


.dragging {
  //border: solid 4px salmon !important;
  overflow: collapse;

  //max-width: 800px;
}


</style>

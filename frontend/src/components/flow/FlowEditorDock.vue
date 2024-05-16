<template>
  <div class="flow-dock">
    <q-toolbar>
      <q-toolbar-title>{{title}}</q-toolbar-title>
      <div class="q-gutter-sm"></div>
    </q-toolbar>
    <q-list padding>
      <template v-for="category in nodes">
        <q-item-label header v-bind:key="category.label">{{
          category.label
        }}</q-item-label>

        <q-item
          v-for="component in category.components"
          :key="component.id"
          draggable="true"
          v-on:dragstart="dragstart(component.id, $event)"
        >
          <q-item-section avatar>
            <q-icon :name="component.icon" />
          </q-item-section>
          <q-item-section>{{ component.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import { MetaFlowCategory } from 'src/components/flow/components/Index'

@Component
export default class MapEditorComponent extends Vue {

  @Prop({
    validator: (x) => typeof x === "string" && x.length > 0,

    default: "Notes"
  })
  title?: string;

  @Prop({
    validator: (x) => x && Array.isArray(x) && x.length > 0
  })
  nodes!: Array<MetaFlowCategory>

  dragstart (id: string, ev: DragEvent) {
    if (!ev.dataTransfer) return

    ev.dataTransfer.setData('componentId', id)
  }
}
</script>

<style lang="scss" scoped>
  .flow-dock {
    height: 100%;
  }
</style>

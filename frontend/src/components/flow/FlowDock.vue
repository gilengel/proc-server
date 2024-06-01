<template>
  <div class="flow-dock" data-testid="flow-dock">
    <q-toolbar>
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <div class="q-gutter-sm"></div>
    </q-toolbar>
    <q-list padding>
      <template v-for="category in nodes" :key="category.label">
        <q-item-label header>{{ category.label }}</q-item-label>

        <q-item
          v-for="element in category.elements"
          :key="element.type"
          :data-testid="`flow-dock-item-${element.type.toLowerCase()}`"
          draggable="true"
          v-on:dragstart="
            addObjectToDataTransfer($event, {
              componentId: element.type,
            })
          "
        >
          <q-item-section avatar>
            <q-icon :name="element.icon" />
          </q-item-section>
          <q-item-section>{{ element.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<!-- PROPS -->
<script
  lang="ts"
  generic="
    Element extends FlowElement<ElementType, ElementAttributeType, ElementAttributeType extends string>,
    ElementType extends string,
    ElementAttributeType extends string
  "
>
export type FlowDockProps<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  title?: string;

  nodes: MetaFlowCategory<ElementType, ElementAttributeType>[];
};
</script>

<script
  setup
  lang="ts"
  generic="ElementType extends string, ElementAttributeType extends string"
>
import { addObjectToDataTransfer } from 'src/composables/useDrag';
import { MetaFlowCategory } from '.';

defineProps<FlowDockProps<ElementType, ElementAttributeType>>();
</script>

<style lang="scss" scoped>
.flow-dock {
  height: 100%;
}
</style>

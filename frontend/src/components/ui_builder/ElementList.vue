<template>
  <div class="q-pa-md">
    <q-input dark outlined bottom-slots v-model="text" dense>
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <SortableVue
      :list="list"
      :options="dragOptions"
      :itemKey="(element) => element.id"
      :move="onMove"
    >
      <template #item="{ element }">
        <q-item
          clickable
          v-ripple
          class="list-group-item"
          :key="element.id"
          :data-element="element.name.toLowerCase()"
        >
          <q-item-section>
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            {{ element.name }}
          </q-item-section>
        </q-item>
      </template>
    </SortableVue>
  </div>
</template>

<script lang="ts">
export interface WidgetElement {
  name: string;
  order: number;
  fixed: boolean;
}
</script>
<script setup lang="ts">
import Sortable from 'sortablejs';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import { ElementType } from 'src/models/Grid';
import { ComputedRef, computed, ref } from 'vue';

const text = '';

const list: ComputedRef<WidgetElement[]> = computed(() => {
  const keys = Object.keys(ElementType);
  return keys.map((name, index) => {
    return { name, order: index, fixed: false };
  });
});

const dragOptions = ref({
  animation: 150,
  group: { name: 'shared', pull: 'clone', put: false },
  sort: false,

  setData: (dataTransfer: DataTransfer, e: HTMLElement) => {
    const elementType = e.getAttribute('data-element');
    if (!elementType) {
      console.error(
        "custom attribute 'data-element' is missing but required for drag and drop of elements to work",
      );
    }

    dataTransfer.setData('data-element', elementType as string);
  },
});

function onMove(evt: Sortable.MoveEvent): boolean {
  const targetClassList = evt.related.classList;

  if (targetClassList.contains('layout-row')) {
    //return false;
  }

  return true;
  // return false; — for cancel
}
</script>

<style lang="scss" scoped></style>

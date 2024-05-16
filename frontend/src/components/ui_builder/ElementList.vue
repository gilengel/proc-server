<template>
  <div class="q-pa-md">
    <q-input dark outlined bottom-slots v-model="text" dense>
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <Sortable
      :list="list"
      :itemKey="(element) => element.id"
      :move="onMove"
      @choose="(event) => console.log(event)"
      @end="(event) => console.log(event)"
    >
      <template #item="{ element }">
        <q-item clickable v-ripple class="list-group-item" :key="element.id">
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
    </Sortable>
  </div>
</template>

<script setup lang="ts">
import { Sortable } from 'sortablejs-vue3';
import { computed } from 'vue';

const text = '';
const elements = ['Heading', 'Text', 'Button', 'Map'];

const list = computed(() =>
  elements.map((transform, index) => {
    return { name: transform, order: index, fixed: false };
  }),
);

//const dragOptions = {
//  animation: 200,
//  group: 'description',
//  disabled: false,
//  ghostClass: 'ghost',
//};

/*
  get list(): Array<ListItem> {
    return this.elements.map((transform, index) => {
      return { name: transform, order: index, fixed: false };
    });
  }

  set list(a: Array<ListItem>) {
    const list = a.map((transform) => {
      return transform.name;
    });

    this.elements = list;
  }


  get dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };
  }
  */

/*
const emit = defineEmits(['startDragging', 'stopDragging']);


function onStart() {
  emit('startDragging');
}

function onEnd() {
  emit('stopDragging');
}
*/
function onMove(evt: { related: { classList: DOMTokenList } }): boolean {
  const targetClassList = evt.related.classList;

  if (targetClassList.contains('layout-row')) {
    //return false;
  }

  console.log(evt.related);

  return true;
  // return false; — for cancel
}
</script>

<style lang="scss" scoped></style>

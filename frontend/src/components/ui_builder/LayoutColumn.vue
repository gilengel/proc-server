<template>
  <div class="layout-col">
    <div class="actions" v-if="editable">
      <q-btn dark flat round color="white" icon="las la-plus">
        <q-menu dark>
          <q-list style="min-width: 100px">
            <template v-for="element in allowedElements" :key="element">
              <q-item clickable v-close-popup>
                <q-item-section>{{ element }}</q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-menu>
      </q-btn>
      <q-btn
        :disable="splitDisabled"
        dark
        flat
        round
        color="white"
        icon="las la-columns"
        @click="gridModuleStore.splitColumn(rowIndex, columnIndex)"
      />
      <q-btn
        dark
        flat
        round
        color="white"
        icon="las la-trash-alt"
        :disable="model.width === 12"
        @click="gridModuleStore.deleteColumn(rowIndex, columnIndex)"
      />
    </div>

    <component
      :is="elementComponent"
      v-bind="{ uuid: '', editable: true, model: model.element }"
    />

    <SortableVue
      :list="emptyList"
      :itemKey="(e: WorkaroundElement) => e.id"
      :options="dropOptions"
      tag="div"
      @end="onEnd($event)"
      @add="elementAdded($event as AddEvent)"
    >
      <template #item="{ element }">
        <div class="draggable" :key="element.id">
          {{ element.id }}
        </div>
      </template>
    </SortableVue>
  </div>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs';
import { Sortable as SortableVue } from 'sortablejs-vue3';
import { Column, Element, ElementType, ElementTypes } from '../../models/Grid';
import { useGridModuleStore } from '../../stores/gridModule';
import { colValidator } from './common';
import { ComputedRef, PropType, computed, ref } from 'vue';

import { getModule } from './index';

// Workaround as Sortable.SortableEvent type does not correctly contains the original event
// which is necessary to get the transferred data (as defined by setData)
type AddEvent = Sortable.SortableEvent & {
  originalEvent: DragEvent;
  add: Sortable.SortableEvent;
};

const gridModuleStore = useGridModuleStore();

const dropOptions = ref({
  animation: 150,
  group: { name: 'shared', pull: 'false', put: true },
});

const elementComponent = computed(() => {
  if (!props.model.element) {
    return undefined;
  }

  const module = getModule(props.model.element.type);
  return module.Element;
});

const props = defineProps({
  /**
   * The index of the row which is the parent of the column
   */
  rowIndex: {
    type: Number,
    required: true,
  },

  /**
   * The index of the column within its parent row
   */
  columnIndex: {
    type: Number,
    default: 2,
    required: true,
    validator: colValidator,
  },

  /**
   * The allowed element types that can be added to the column.
   *
   * This is an optional property and defaults back to all available element types
   * if not specified.
   */
  allowedElements: {
    type: Object as PropType<ElementType[]>,
    default: ElementTypes,
  },

  /**
   * The model that contains the associated data with the column.
   */
  model: {
    type: Object as PropType<Column>,
    required: true,
  },

  /**
   * Enables/Disables editability of the column. If disabled the toolbar on top is not shown
   * to the user.
   */
  editable: {
    type: Boolean,
    required: false,
    default: true,
  },

  /**
   * Controls if the column can be splitted into two or not. This is necessary to
   * enable/disable the corresponding button in the toolbar.
   */
  splitDisabled: Boolean,
});

const emit = defineEmits<{
  selectElement: [element: Element];
}>();

// This is a workaround element type for the sortable container that, for this element,
// does not display anything as we don't want to display a list of element but always
// one element. This element is displayed on another position to avoid visual glitches.
interface WorkaroundElement {
  id: string | undefined;
}

// Empty list for the sortable container as a workaround.
const emptyList: ComputedRef<WorkaroundElement[]> = computed(() => []);

/**
 * Callback that gets called once a "element" is dropped on the container
 * @param event The event containing the dropped element. In order to make this work the
 *              event must have a value stored in the DataTransfer object with the key
 *              'data-element' and a valid value of a ElementType enum key (but all in lowercase).
 */
function elementAdded(event: AddEvent) {
  event.preventDefault();

  // workaround to directly remove the already dropped and added element. Not the
  // best solution :( but it works.
  event.target.removeChild(event.item);

  // get the type from the DataTransfer object and convert it back to the correct enum key
  const type = event.originalEvent.dataTransfer?.getData(
    'data-element',
  ) as string;
  const typeKey = type.charAt(0).toUpperCase() + type.slice(1);

  const typeEnum: ElementType =
    ElementType[typeKey as keyof typeof ElementType];

  gridModuleStore.setColumnElement(props.model, typeEnum);
  emit('selectElement', props.model.element as Element);
}

function onEnd(event: Sortable.SortableEvent) {
  event.item.remove();
}
</script>

<style lang="scss" scoped>
.layout-col {
  position: relative;
  border: 1px solid $border;
  border-left: none;
  text-align: center;
  min-height: 128px;

  padding: 1em;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-content: stretch;
  justify-content: center;

  > div {
    width: 100%;
    padding: 1em;
  }

  > .actions {
    position: absolute;
    top: 0;
    left: 50%;
    z-index: 3;
    width: auto;

    transform: translate(-50%, -2px);

    padding: 0;
    background: $primary;
    visibility: collapse;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
}

.layout-col:hover {
  outline: solid 2px $primary;
}

.layout-col:hover > .actions {
  visibility: visible;
}

.layout-col:first-of-type {
  border-left: 1px solid $border;
}
</style>

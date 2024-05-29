<template>
  <div style="display: flex; flex-direction: column" data-testid="flow-editor">
    <q-toolbar class="text-primary">
      <q-btn flat round dense icon="las la-sitemap" @click="rearrangeNodes">
        <q-tooltip>Auto arrange nodes</q-tooltip>
      </q-btn>
    </q-toolbar>

    <q-splitter v-model="dockWidth" unit="px" style="height: 100%">
      <template v-slot:before
        ><FlowDock title="Nodes" :nodes="categories"
      /></template>
      <template v-slot:after><div ref="editor"></div></template>
    </q-splitter>
  </div>
</template>

<script
  setup
  lang="ts"
  generic="
    GenericElement extends FlowElement<
      GenericElementType,
      GenericElementAttributeType
    >,
    GenericElementType extends string,
    GenericElementAttributeType extends string
  "
>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';

import { AreaExtensions } from 'rete-area-plugin';

import { ReteEditor, createEditor } from './editor';
import { MetaFlowCategory, MetaFlowCategoryElement } from './index';

import FlowDock from './FlowDock.vue';
import { useDrop } from 'src/composables/useDrop';
import { FlowElement } from './model';

type FlowEditorGridProps = {
  enabled: boolean;
  size: number;
};

type FlowEditorProps<
  GenericElement extends FlowElement<
    GenericElementType,
    GenericElementAttributeType
  >,
  GenericElementType extends string,
  GenericElementAttributeType extends string,
> = {
  elements: GenericElement[];

  categories: MetaFlowCategory<
    GenericElementType,
    GenericElementAttributeType
  >[];

  grid?: FlowEditorGridProps;
};

const editor = ref(null);

const props =
  defineProps<
    FlowEditorProps<
      GenericElement,
      GenericElementType,
      GenericElementAttributeType
    >
  >();

let reteEditor:
  | ReteEditor<FlowElement<GenericElementType, GenericElementAttributeType>>
  | undefined = undefined;

defineExpose({
  process: (element: GenericElement) => {
    reteEditor!.engine.reset();

    reteEditor!.editor
      ?.getConnections()
      .filter((connection) => connection.source == element.id)
      .map((connection) => connection.target)
      .forEach((nodeId) => reteEditor!.engine.fetch(nodeId));
  },
});

const dockWidth = ref(400);

// All elements that can be created by the user. The elements are defined via the categories prop
// and are extracted from there
const creatableElements = computed(() => {
  const elements: MetaFlowCategoryElement<
    GenericElementType,
    GenericElementAttributeType
  >[] = [];
  for (const category of props.categories) {
    elements.push(...category.elements); // concat does not work as elements is empty
  }

  return elements;
});

// Init the rete editor on mount
onMounted(async () => {
  reteEditor = await createEditor<
    FlowElement<GenericElementType, GenericElementAttributeType>
  >(editor.value!);

  reteEditor.editor.addPipe((context) => {
    if (context.type === 'connectioncreated') {
      reteEditor!.engine.reset();
      reteEditor!.engine.fetch(context.data.source);
      reteEditor!.engine.fetch(context.data.target);
    }

    return context;
  });
});

type ComponentType = {
  componentId: GenericElementType;
};

// Callback that is called once a element is dropped on the editor (from the dock)
useDrop(editor, (e: object) => {
  const object = e as ComponentType;

  const element = creatableElements.value.find((e) => {
    return e.type == object.componentId;
  });
  if (!element) {
    console.error(
      `Internal error: the element ${object.componentId} does not exist`,
    );
    return;
  }

  addElementNode(element.create()).then(() => {});
});

// Add all elements that are not already in the editor if the elements
// property is changed
watch(
  () => props.elements,
  (newElements) => {
    let difference = newElements.filter(
      (newElement) =>
        reteEditor!.editor
          ?.getNodes()
          .find((node) => node.id === newElement.id) === undefined,
    );

    for (let element of difference) {
      addElementNode(element).then(() => {});
    }
  },
  {
    deep: true,
  },
);

// Update if elements shall be snapped to a grid or not if the grid
// property is changed
watch(
  () => props.grid,
  (prop: FlowEditorGridProps | undefined) => {
    if (!reteEditor) {
      return;
    }

    AreaExtensions.snapGrid(reteEditor.area, {
      size: prop && prop.enabled ? prop.size : 1,
    });
  },
);

onUnmounted(() => {
  reteEditor!.area.destroy();
});

async function addElementNode(
  element: FlowElement<GenericElementType, GenericElementAttributeType>,
) {
  await reteEditor?.editor.addNode(element);
}

async function rearrangeNodes() {
  await reteEditor?.arrange.layout();
}
</script>

<style scoped lang="scss">
div {
  width: 100%;
  height: 800px;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
FlowEditorElement,

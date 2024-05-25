<template>
  <q-splitter v-model="dockWidth" unit="px" style="height: 100%">
    <template v-slot:before
      ><FlowDock title="Nodes" :nodes="categories"
    /></template>
    <template v-slot:after><div ref="editor"></div></template>
  </q-splitter>
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
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';

import { AreaExtra, createEditor } from './editor';
import { MetaFlowCategory } from './index';

import FlowDock from './FlowDock.vue';
import { useDrop } from 'src/composables/useDrop';
import { FlowElement } from './model';
import { DataflowEngine } from 'rete-engine';

export type Schemes<
  GenericElementType extends string,
  GenericElementAttributeType extends string,
> = GetSchemes<
  FlowElement<GenericElementType, GenericElementAttributeType>,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

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

let e:
  | NodeEditor<Schemes<GenericElementType, GenericElementAttributeType>>
  | undefined = undefined;
let area:
  | AreaPlugin<
      Schemes<GenericElementType, GenericElementAttributeType>,
      AreaExtra<Schemes<GenericElementType, GenericElementAttributeType>>
    >
  | undefined = undefined;
let engine: DataflowEngine<
  Schemes<GenericElementType, GenericElementAttributeType>
>;

defineExpose({
  process: (element: GenericElement) => {
    engine.reset();

    e
      ?.getConnections()
      .filter((connection) => connection.source == element.id)
      .map((connection) => connection.target)
      .forEach((nodeId) => engine.fetch(nodeId));
  },
});

const dockWidth = ref(400);

// All elements that can be created by the user. The elements are defined via the categories prop
// and are extracted from there
const creatableElements = computed(() => {
  const elements: FlowElement<
    GenericElementType,
    GenericElementAttributeType
  >[] = [];
  for (const category of props.categories) {
    const defaultElements = category.elements.map((e) => e.defaultElement);
    elements.push(...defaultElements); // concat does not work as elements is empty
  }

  return elements;
});

// Init the rete editor on mount
onMounted(async () => {
  const reteEditor = await createEditor<
    Schemes<GenericElementType, GenericElementAttributeType>
  >(editor.value!);
  e = reteEditor.editor;
  area = reteEditor.area;
  engine = reteEditor.engine;

  e.addPipe((context) => {
    if (context.type === 'connectioncreated') {
      engine.reset();
      engine.fetch(context.data.source);
      engine.fetch(context.data.target);
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

  addElementNode(element).then(() => {});
});

// Add all elements that are not already in the editor if the elements
// property is changed
watch(
  () => props.elements,
  (newElements) => {
    let difference = newElements.filter(
      (newElement) =>
        e?.getNodes().find((e) => e.id === newElement.id) === undefined,
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
    if (!area) {
      return;
    }

    AreaExtensions.snapGrid(
      area as AreaPlugin<
        Schemes<GenericElementType, GenericElementAttributeType>,
        AreaExtra<Schemes<GenericElementType, GenericElementAttributeType>>
      >,
      {
        size: prop && prop.enabled ? prop.size : 1,
      },
    );
  },
);

onUnmounted(() => {
  area!.destroy();
});

async function addElementNode(
  element: FlowElement<GenericElementType, GenericElementAttributeType>,
) {
  await e!.addNode(element);
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
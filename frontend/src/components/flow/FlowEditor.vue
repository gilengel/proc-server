<template>
  <q-splitter v-model="leftWidth" unit="px" style="height: 100%">
    <template v-slot:before
      ><FlowDock title="Nodes" :nodes="categories"
    /></template>
    <template v-slot:after><div ref="editor"></div></template>
  </q-splitter>
</template>

<script
  setup
  lang="ts"
  generic="ElementType extends string, ElementAttributeType extends string"
>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { ClassicPreset, NodeEditor } from 'rete';
import { AreaExtensions, AreaPlugin } from 'rete-area-plugin';

import { AreaExtra, Schemes, createEditor } from './editor';
import { MetaFlowCategory } from './index';

import FlowDock from './FlowDock.vue';
import { Element } from 'src/models/Grid';
import { useDrop } from 'src/composables/useDrop';
import { FlowElement } from './model';

const editor = ref(null);

type IFlowEditorGridProps = {
  enabled: boolean;
  size: 20;
};
type IFlowEditorProps<
  ElementType extends string,
  ElementAttributeType extends string,
> = {
  elements: Element[];

  categories: MetaFlowCategory<ElementType, ElementAttributeType>[];

  grid?: IFlowEditorGridProps;
};

const props =
  defineProps<IFlowEditorProps<ElementType, ElementAttributeType>>();

let e: NodeEditor<Schemes> | undefined = undefined;
let area: AreaPlugin<Schemes, AreaExtra> | undefined = undefined;

const leftWidth = ref(400);

const creatableElements = computed(() => {
  const elements: FlowElement<ElementType, ElementAttributeType>[] = [];
  for (const category of props.categories) {
    const defaultElements = category.elements.map((e) => e.defaultElement);
    elements.push(...defaultElements); // concat does not work as elements is empty
  }

  return elements;
});

onMounted(async () => {
  const reteEditor = await createEditor(editor.value!);
  e = reteEditor.editor;
  area = reteEditor.area;
});

type ComponentType = {
  componentId: ElementType;
};
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
  (first) => {
    let difference = first.filter(
      (x) => e?.getNodes().find((e) => e.id === x.uuid) === undefined,
    );

    for (let a of difference) {
      addElementNode(a).then(() => {});
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
  (prop: IFlowEditorGridProps | undefined) => {
    if (!area) {
      return;
    }

    AreaExtensions.snapGrid(area as AreaPlugin<Schemes, AreaExtra>, {
      size: prop && prop.enabled ? prop.size : 1,
    });
  },
);

onUnmounted(() => {
  area!.destroy();
});

async function addElementNode<
  ElementType extends string,
  ElementAttributeType extends string,
>(element: FlowElement<ElementType, ElementAttributeType>) {
  const textSocket = new ClassicPreset.Socket('text');

  const b = new ClassicPreset.Node(element.type);
  b.id = element.uuid; // the cleaner way would be to use a custom preset - but this works also :)

  if (element.inputs) {
    for (const input of element.inputs) {
      const textSocket = new ClassicPreset.Socket(input.type);

      b.addInput(input.type, new ClassicPreset.Input(textSocket));
    }
  }

  if (element.outputs) {
    for (const output of element.outputs) {
      b.addOutput(output.type, new ClassicPreset.Output(textSocket));
    }
  }

  await e!.addNode(b);
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

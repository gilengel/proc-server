<template>
  <div class="column full-height">
    <q-toolbar>
      <q-toolbar-title shrink style="margin-right: 2em">Widget Builder</q-toolbar-title>

      <q-btn-toggle
        v-model="model"
        push
        flat
        toggle-color="primary"
        :options="[
          { value: 'one', slot: 'one' },
          { value: 'two', slot: 'two' },
        ]"
      >
        <template v-slot:one>
          <div>
            <q-icon name="las la-link" />
          </div>
        </template>

        <template v-slot:two>
          <div>
            <q-icon name="las la-project-diagram" />
          </div>
        </template>
      </q-btn-toggle>

      <ToggleButton
        color="white"
        selected-color="primary"
        icon="las la-link"
        label="Link to elements together"
        v-model="linkModeActive"
      />

      <q-space />
      <StyleSelector />
      <q-btn
        style="
          background: salmon;
          color: white;
          margin-top: 8px;
          margin-bottom: 8px;
        "
        label="Save Layout"
      />
    </q-toolbar>
    <WidgetLayout v-show="model == 'one'" />

    <div style="flex-grow: 1">
      <FlowEditorComponent
        :nodes="nodes"
        dockPosition="left"
        :dockWidth="10"
        flowTitle="Graph"
        v-show="model == 'two'"
      />
    </div>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import StyleSelector from "components/StyleSelector.vue";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import ButtonOptions from "components/ui_builder/ButtonOptions.vue";
import OutputOptions from "components/ui_builder/OutputOptions.vue";
import TextOptions from "components/ui_builder/TextOptions.vue";
import HeadingOptions from "components/ui_builder/HeadingOptions.vue";
import ConnectionOptions from "components/ui_builder/ConnectionOptions.vue";
import ToggleButton from "components/ToggleButton.vue";
import ElementList from "components/ui_builder/ElementList.vue";
import FlowEditorComponent from "components/flow/FlowEditorComponent.vue";
import WidgetLayout from "components/ui_builder/WidgetLayout.vue";
import { Action, Getter } from "vuex-class";
import { getRegisteredComponentCategories } from "src/components/flow/components/Index";
import { Node as ReteNode, Connection as ReteConnection } from "rete";
import FlowEventBus, {
  FLOW_NODES_CONNECTED,
  FLOW_NODES_DISCONNECTED,
  FLOW_NODE_ADDED,
} from "components/flow/FlowEventBus";

import { buildParameterPin, Direction } from "components/flow/models/Component";

import { VariableModel } from "src/models/Variable";

import {
  Grid,
  Element,
  ElementType,
  Row,
  Column,
  ElementConnection,
} from "../models/Grid";

import { createTextElement } from "src/store/GridModule";

import draggable from "vuedraggable";

@Component({
  name: "MainLayout",

  components: {
    StyleSelector,

    draggable,
    LayoutRow,
    ButtonOptions,
    TextOptions,
    HeadingOptions,
    ToggleButton,
    ConnectionOptions,
    ElementList,
    OutputOptions,
    FlowEditorComponent,
    WidgetLayout,
  },
})
export default class UiBuilderLayout extends Vue {
  @Getter("selectedModels")
  getSelectedElements!: () => Array<any>;

  @Getter("grid")
  grid!: Grid;

  @Getter("connections")
  connections!: () => Array<ElementConnection>;

  @Action("addRow")
  addRow!: (row: Row) => void;

  @Action("deleteRow")
  deleteRow!: (rowIndex: number) => void;

  @Action("removeAllSelectedElementsAndModels")
  clearSelectedElements!: () => void;

  @Action("addSelectedElementAndModel")
  addSelectedElement!: (param: {
    element: string;
    model: any;
    clearPreviousSelected: boolean;
  }) => void;

  @Action("addElementToColumn")
  addElementToColumn!: (param: {
    column: Column;
    element: Element;
  }) => Promise<void>;

  @Action("linkTwoElements")
  linkTwoElements!: (param: {
    identifier: string;
    start: Element;
    end: Element;
  }) => void;

  @Action("unlinkTwoElements")
  unlinkTwoElements!: (param: {
    identifier: string;
    start: Element;
    end: Element;
  }) => void;

  model = "two";

  linkModeActive: boolean = false;

  get nodes() {
    return getRegisteredComponentCategories();
  }

  get selectedElement(): Element | {} {
    const elements = this.getSelectedElements;

    if (elements.length !== 1) {
      return {};
    }

    let element = null;
    for (let item of elements) {
      element = item;
    }

    return element;
  }

  pageElements = [
    {
      id: "row",
      label: "Row",
      icon: "las la-table",
      type: ElementType.Row,
      defaultData: {},
    },

    {
      id: "text",
      label: "Text",
      icon: "las la-keyboard",
      type: ElementType.Text,
      defaultData: {},
    },

    {
      id: "button",
      label: "Button",
      icon: "las la-paper-plane",
      type: ElementType.Button,
      defaultData: {},
    },
  ];

  drag = false;
  rowDraggingDisabled = false;

  get dragOptions() {
    return {
      animation: 200,
      group: "description",
      disabled: this.rowDraggingDisabled,
      ghostClass: "ghost",
    };
  }

  widgetDraggingStarted() {
    this.rowDraggingDisabled = true;
  }

  widgetDraggingStopped() {
    this.rowDraggingDisabled = false;
  }
  /*
  dragOptions = {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost",
  };
  */

  private extractElementsFromReteConnection(connection: ReteConnection): {
    input: Element;
    output: Element;
  } {
    if (!connection.input.node || !connection.output.node) {
      throw new Error(
        `The newly created connection between two nodes has an invalid input node, an invalid output node or both.`
      );
    }

    if (
      !connection.input.node.data.elementModel ||
      !connection.output.node.data.elementModel
    ) {
      throw new Error(
        `The elementModel is not specified for the input, output or both of the new connection. Check if you set it properly after a new node was created`
      );
    }

    const inputElement = connection.input.node.data.elementModel as Element;
    const outputElement = connection.output.node.data.elementModel as Element;

    if (!outputElement.outputs || outputElement.outputs.length == 0) {
      // TODO rework in order to make this check obsolet
      throw new Error(
        `You linked an output element that has no defined outputs`
      );
    }

    return { input: inputElement, output: outputElement };
  }

  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        (this.getSelectedElements as unknown as Set<Element>).forEach(
          (element: Element) => {
            //element.column.element = null;
          }
        );
      }
    });

    FlowEventBus.$on(FLOW_NODE_ADDED, (node: ReteNode) => {
      switch (node.name) {
        case "Text": {
          for (const row of this.grid.rows) {
            for (const column of row.columns) {
              if (!column.element) {
                const element = createTextElement();
                console.log(element.uuid);
                this.addElementToColumn({
                  column: column,
                  element: element,
                }).then((v) => {
                  //Vue.set(node.data, 'elementModel', element)
                });

                node.data.elementModel = element;

                return;
              }
            }
          }
          break;
        }
        case "Input": {
          break;
        }
        default:
          break;
      }
    });

    FlowEventBus.$on(FLOW_NODES_CONNECTED, (connection: ReteConnection) => {
      const inputNode = connection.input.node;
      const outputNode = connection.output.node;

      if (!inputNode || !outputNode) {
        return;
      }

      if (inputNode.name === "SplitObject") {
        const data = outputNode.data as Record<string, VariableModel>;
        const result = new Array();

        for (const key in data) {
          const inputsCount = inputNode.outputs.size;
          const id = `variable${inputsCount}`;
          const a = {
            type: `variable`,
            id: key,
            label: data[key].identifier,
            mandatory: true,
          };

          buildParameterPin(
            outputNode.vueContext.$props.emitter,
            inputNode,
            a,
            Direction.Out
          );
        }
      }

      if (inputNode.name !== "Text" || outputNode.name === "Text") {
        return;
      }

      const { input, output } =
        this.extractElementsFromReteConnection(connection);

      if (input.outputs) {
        this.linkTwoElements({
          identifier: input.outputs[0].identifier,
          start: output,
          end: input,
        });
      }
    });

    FlowEventBus.$on(FLOW_NODES_DISCONNECTED, (connection: ReteConnection) => {
      const inputNode = connection.input.node;
      const outputNode = connection.output.node;

      if (!inputNode || !outputNode) {
        return;
      }

      if (inputNode.name === "SplitObject") {
        for (const output of inputNode.outputs) {
          inputNode.removeOutput(output[1]);
        }

        return;
      }
      const { input, output } =
        this.extractElementsFromReteConnection(connection);

      if (input.outputs) {
        this.unlinkTwoElements({
          identifier: input.outputs[0].identifier,
          start: output,
          end: input,
        });
      }
    });
  }
}
</script>

<style lang='scss' scoped>
$size: 24px;
.ghost {
  //border: solid 2px salmon;
  border-radius: 4px;

  color: $primary;
  //height: $size;

  overflow: collapse;
}

.options-container {
  //border: solid 2px $primary;
  border: 1px solid rgb(100, 100, 100);
}

svg {
  position: absolute;
  height: 100%;
  width: 80%;
}

line {
  stroke: $accent;
  stroke-width: 4px;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }
}
</style>

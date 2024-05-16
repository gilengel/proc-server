<template>
    <div class="row">
          <div class="col-2">
            <ElementList @startDragging="widgetDraggingStarted" @stopDragging="widgetDraggingStopped" />
                        <OutputOptions
            :uuid="selectedElement.uuid"
            :model="selectedElement"

            />
          </div>
          <div class="col-8">

            <draggable
              handle=".drag-handle"
              class="dragArea list-group"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                type="transition"
                :name="!drag ? 'flip-list' : null"
              >
                <LayoutRow
                  dataKey="itemId"
                  dataValue="Row"
                  :linkModeActive="linkModeActive"
                  :deleteRow="deleteRow"
                  :model="row"
                  :rowIndex="row_index"
                  :key="row_index"
                  v-for="(row, row_index) in grid.rows"
                />
              </transition-group>
            </draggable>
          </div>
          <div class="col-2 options-container" ref="options_container">
            <ButtonOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-if="selectedElement && selectedElement.type === 'Button'"
            />

            <TextOptions
              :uuid="selectedElement.uuid"
              :model="selectedElement"
              v-else-if="selectedElement && selectedElement.type === 'Text'"
            />

            <HeadingOptions
            :uuid="selectedElement.uuid"
            :model="selectedElement"
            v-else-if="selectedElement && selectedElement.type === 'Heading'"
            />

            <ConnectionOptions
            :uuid="selectedElement.uuid"
            :model="selectedElement"
            v-else-if="selectedElement.uuid"
            />

            <OutputOptions
            :uuid="selectedElement.uuid"
            :model="selectedElement"
            v-else
            />

          </div>
        </div>
        </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import LayoutRow from "components/ui_builder/LayoutRow.vue";
import ButtonOptions from "components/ui_builder/ButtonOptions.vue";
import OutputOptions from "components/ui_builder/OutputOptions.vue";
import TextOptions from "components/ui_builder/TextOptions.vue";
import HeadingOptions from "components/ui_builder/HeadingOptions.vue";
import ConnectionOptions from "components/ui_builder/ConnectionOptions.vue";
import ToggleButton from "components/ToggleButton.vue";
import ElementList from "components/ui_builder/ElementList.vue";
import { Action, Getter } from "vuex-class";

import {
  Grid,
  Element,
  ElementType,
  Row,
  ElementConnection
} from "src/models/Grid"

import draggable from "vuedraggable";

@Component({
  components: {
    draggable,
    LayoutRow,
    ButtonOptions,
    TextOptions,
    HeadingOptions,
    ToggleButton,
    ConnectionOptions,
    ElementList,
    OutputOptions,
  },
})
export default class WidgetLayout extends Vue {
  @Getter("selectedModels")
  getSelectedElements!: () => Array<any>;

  @Getter("grid")
  grid!: () => Grid;

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

  model = "one";

  linkModeActive: boolean = false;

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

  mounted() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Delete") {
        ((this.getSelectedElements as unknown) as Set<Element>).forEach(
          (element: Element) => {
            //element.column.element = null;
          }
        );
      }
    });
  }
}
</script>

<style lang='scss'>
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

line {
  stroke: $accent;
  stroke-width: 4px;
}

.linkage-triangle-preview {
  position: absolute;
  //fill: $accent;
  fill: $accent;
  stroke: $accent;
  stroke-width: 6px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.q-btn-group {
  > button {
    border-radius: 50% !important;
    width: 42px;
    height: 42px;
  }

  > button:not(:last-of-type) {
    //margin-right: 0.5em;
  }
}
</style>

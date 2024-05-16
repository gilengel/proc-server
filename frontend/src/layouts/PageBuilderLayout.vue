<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>Page Builder</q-toolbar-title>
          <q-btn flat round dense>
            <q-btn
              round
              color="primary"
              icon="las la-save"
              @click="saveLayout"
            />
          </q-btn>
        </q-toolbar>
        <div class="row">
          <div class="col-1">
            <div class="q-pa-md">
              <q-list dark padding>
                <template v-for="category in widgetCategories">
                  <q-item-label :key="category.label" header>
                    {{ category.label }}
                  </q-item-label>

                  <q-item
                    v-for="component in category.components"
                    :key="component.id"
                    draggable
                    @dragstart="startDrag($event, component)"
                  >
                    <q-item-section avatar>
                      <q-icon :name="component.icon" />
                    </q-item-section>
                    <q-item-section>{{ component.label }}</q-item-section>
                  </q-item>
                </template>
              </q-list>
            </div>
          </div>
          <div
            class="col-11 drop-zone"
            @drop="onDrop($event)"
            @dragover.prevent
            @dragenter.prevent
          >
            <h1 v-if="!layout">Something went wrong loading the view :(</h1>

            <grid-layout
              v-else
              :layout.sync="layout.widgets"
              :col-num="12"
              :row-height="30"
              :is-draggable="true"
              :is-resizable="true"
              :vertical-compact="true"
              :use-css-transforms="false"
              :margin="[0, 0]"
              class="noselect"
            >
              <grid-item
                v-for="widget in layout.widgets"
                :key="widget.id"
                :static="widget.static"
                :x="widget.x"
                :y="widget.y"
                :w="widget.w"
                :h="widget.h"
                :i="widget.i"
                drag-allow-from=".vue-draggable-handle"
                drag-ignore-from=".no-drag"
              >
                <component
                  :is="widget.component"
                  :uuid="widget.i"
                  :resizable="true"
                  :draggable="true"
                  :deletable="true"
                  v-bind="widget.properties"
                  @remove-widget="onRemoveWidget"
                />
              </grid-item>
            </grid-layout>
          </div>
        </div>
      </q-page>
    </q-page-container>

    <q-banner inline-actions class="text-white bg-red" v-if="error">
      {{ errorMessage }}
      <template v-slot:action>
        <q-btn flat color="white" label="Try Again" />
      </template>
    </q-banner>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import { GridLayout, GridItem } from "vue-grid-layout";
import Widget from "components/Widget.vue";
import TableWidget from "components/TableWidget.vue";
import ImageWidget from "components/ImageWidget.vue";
import TextWidget from "components/TextWidget.vue";
import ChartWidget from "src/components/ChartWidget.vue";
import FlowGraphWidget from "components/FlowGraphWidget.vue";
import MapWidget from "components/MapWidget.vue";
import IdeWidget from "components/IdeWidget.vue";
import TodoWidget from "components/TodoWidget.vue";
import ListWidget from "components/ListWidget.vue";
import FormWidget from "components/FormWidget.vue";
import { GetOne, UpdateOne, PAGES_URL } from "../models/Backend";

import {
  getRegisteredComponentCategories,
  MetaFlowCategory,
  MetaFlowComponent,
} from "components/flow/components/Index"

import { Node as ReteNode } from "rete";

import { v4 as uuidv4 } from "uuid";

import axios from "axios";
import { Page } from "../components/flow/Page";

interface Widget {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  movable: boolean;
  component: string;
  properties?: {};
}

interface View {
  id: string;
  name: string;
  widgets: Array<Widget>;
}

interface ServerResponse {
  data: View;
}

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    Widget,
    TableWidget,
    ImageWidget,
    TextWidget,
    FlowGraphWidget,
    ChartWidget,
    IdeWidget,
    MapWidget,
    TodoWidget,
    ListWidget,
    FormWidget,
  },
})
export default class MainLayout extends Vue {
  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

  layout: View | null = null;

  page: Page | null = null;

  widgetCategories: Array<MetaFlowCategory> = getRegisteredComponentCategories();

  error: boolean = false;
  errorMessage: string = "";

  private setDefaultLayout() {
    this.layout = {
      id: "fc339aab-9355-405a-99b3-0ced2fa2361c",
      name: "Candy Layout",
      widgets: [
        {
          i: "78b0262e-392e-4164-9f42-53aac79c4646",
          x: 0,
          y: 0,
          w: 4,
          h: 22,
          movable: false,
          component: "FlowGraphWidget",
          properties: {
            nodes: getRegisteredComponentCategories(),
          },
        },
      ],
    };
  }
  /** Calls the server backend to receive the layout json file */
  private loadLayout() {
    const self = this;

    const pageId = this.$route.params.id;

    GetOne<Page>(`${PAGES_URL}/${pageId}`)
      .then((page) => {
        this.page = Object.assign({}, this.page, page);
        this.setDefaultLayout();

        if (page.data) {
          this.layout = Object.assign({}, this.layout, page.data);
          console.log(this.layout);
        }
      })
      .catch((e) => {
        this.setDefaultLayout();

        this.$q.notify({
          type: "error",
          message: e,
        });
      });
  }

  private saveLayout() {
    this.page?.data = this.layout;
    console.log(this.layout);
    UpdateOne(`${PAGES_URL}/${this.page?.page_pk}`, this.page);
  }

  async mounted() {
    await this.loadLayout();
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }

  onRemoveWidget(id: string) {
    const index = this.layout?.widgets.findIndex(
      (widget: Widget) => widget.i === id
    );
    if (index !== -1) {
      this.layout?.widgets.splice(index as number, 1);
    }
  }

  startDrag(evt: DragEvent, item: MetaFlowComponent) {
    if (evt.dataTransfer === null) {
      return;
    }

    evt.dataTransfer.dropEffect = "move";
    evt.dataTransfer.effectAllowed = "move";
    evt.dataTransfer.setData("itemId", item.id);
  }

  onDrop(evt: DragEvent) {
    if (evt.dataTransfer === null) {
      return;
    }
    const itemId = evt.dataTransfer.getData("itemId");

    const layout = this.layout as View;
    layout.widgets.push({
      i: `${uuidv4()}`,
      x: 6,
      y: layout.widgets.length + (this.colNum || 12), // puts it at the bottom
      w: 2,
      h: 4,

      movable: false,
      properties: {},
      component: this.getWidgetName(itemId),
    });
    this.index++;
  }
}
</script>

<style lang='scss'>
.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}

.noselect {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.drag-el {
  background-color: #fff;
  margin-bottom: 10px;
  padding: 5px;
}
</style>

<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
          <q-btn
            style="
              background: salmon;
              color: white;
              margin-top: 8px;
              margin-bottom: 8px;
            "
            label="Publish"
            @click="walkGraph(reteNodes)"
          />
        </q-toolbar>

        <div class="row">
          <div class="col-10">
            <grid-layout
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
                  v-bind="widget.properties"
                />
              </grid-item>
            </grid-layout>
          </div>

          <div class="col-2" v-if="hasSelectedNode">
            <PageOptions :uuid="selectedNode" />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import { GridLayout, GridItem } from "vue-grid-layout";
import FlowGraphWidget from "components/FlowGraphWidget.vue";
import { MetaFlowCategory } from "components/flow/components/Index"

import PageOptions from "../components/router_builder/PageOptions.vue";
import { TempFlow } from "../models/TempFlow";
import { GetOne, UpdateOne, PostMultiple, PostOne } from "../models/Backend";
import { Node as ReteNode } from "rete";
import { NodeData } from "rete/types/core/data";
import { FLOW_ROUTER_START, FLOW_ROUTER_END } from './RouterFlowModel';
import { v4 as uuidv4 } from "uuid";

import { CreateNowTimestamp } from '../models/Date'

import { Page, NewPage } from '../components/flow/Page'



import { walkGraph, convertReteNode2NewPage } from "./FlowGraphConverter";


import {
  StartFlowComponent,
  PageFlowComponent,
  EndFlowComponent,
} from "./RouterFlowModel";

import EventBus, {
  FLOW_NODE_ADDED,
  FLOW_NODE_REMOVED,
  FLOW_GRAPH_UPDATED,
  FLOW_GRAPH_IMPORTED,
  FLOW_NODE_SELECTED,
  FLOW_GRAPH_MANUALLY_CHANGED,
} from "components/flow/FlowEventBus";


const routingNodes: Array<MetaFlowCategory> = [
  {
    label: "Basic",
    icon: "",

    components: [
      {
        id: "start",
        label: "Start",
        icon: "las la-play",
        component: StartFlowComponent,
      },
      {
        id: "end",
        label: "End",
        icon: "las la-stop",
        component: EndFlowComponent,
      },
      {
        id: "page",
        label: "Page",
        icon: "las la-file",
        component: PageFlowComponent,
      },
    ],
  },
];

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

@Component({
  name: "MainLayout",

  components: {
    GridLayout,
    GridItem,
    FlowGraphWidget,
    PageOptions,
  },
})
export default class RouterLayout extends Vue {
  draggable = true;
  resizable = true;
  colNum = 12;
  index = 0;

  currentRouterGraph: Array<ReteNode> = [];

  @Action("storeNewPage")
  storeNewPage!: (page: NewPage) => void;

  hasSelectedNode: boolean = false;
  selectedNode: string = "";

  graphModel: TempFlow | null = null;

  reteNodes: Array<ReteNode> = [];

  layout: View = {
    id: "fc339aab-9355-405a-99b3-0ced2fa2361c",
    name: "Flowchart Layout",
    widgets: [
      {
        i: "78b0262e-392e-4164-9f42-53aac79c4646",
        x: 0,
        y: 0,
        w: 12,
        h: 30,
        movable: false,
        component: "FlowGraphWidget",
        properties: {
          nodes: routingNodes,
          graph: this.currentRouterGraph,
        },
      },
    ],
  };

  persistFlowModel(node: JSON) {
    this.$q.notify({
      type: "warning",
      message: "updated",
    });

    const model = this.graphModel;

    if (model) {
      model.data = node;

      UpdateOne<TempFlow>(`temp_flow/${model.flow_pk}`, model);
    }
  }

  mounted() {
    GetOne<TempFlow>(`temp_flow/${this.$route.params.id}`)
      .then((flow) => {
        this.graphModel = flow;

        if (flow.data.id && flow.data.nodes) {
          EventBus.$emit(FLOW_GRAPH_IMPORTED, flow.data);
        }
      })
      .catch((error) => {
        this.triggerError(error);
      });

    EventBus.$on(FLOW_NODE_SELECTED, (node: ReteNode) => {
      this.hasSelectedNode = true;
      this.selectedNode = node.data.uuid as string;
    });
    EventBus.$on(FLOW_NODE_ADDED, (node: ReteNode) => {
      if (!node.data.page) {
        node.data = Object.assign({}, node.data, {
          page: convertReteNode2NewPage((node as unknown) as NodeData),
        });
      }

      this.storeNewPage(node.data.page as NewPage);

      this.reteNodes.push(node);

      this.selectedNode = node.data.uuid as string;
    });
    EventBus.$on(FLOW_NODE_REMOVED, (node: JSON) => {});
    EventBus.$on(FLOW_GRAPH_MANUALLY_CHANGED, (node: JSON) => {
      this.persistFlowModel(node);
    });
  }

  getWidgetName(element: string) {
    return `${element.charAt(0).toUpperCase()}${element.slice(1)}Widget`;
  }

  triggerError(message: string) {
    this.$q.notify({
      type: "negative",
      message: message,
    });
  }

  walkGraph(graph: Array<ReteNode>) {
    const startNode = graph.find((node) => node.name === FLOW_ROUTER_START);
    if (!startNode) {
      throw "Persisting aborted: Flow graph has no start point";
    }

    const endNode = graph.find((node) => node.name === FLOW_ROUTER_END);
    if (!endNode) {
      //throw "Persisting aborted: Flow graph has no end point";
    }

    const nodes = new Array<NewPage>();
    for (const node of graph) {
      node.data.walked = undefined;
      nodes.push(node.data.page as NewPage);
    }

    PostMultiple<any>(`pages`, nodes)
      .then((result: any[]) => {
        for (const node of graph) {
          const dbResult = result.find(
            (element) => element.page_id === node.data.uuid
          );
          node.data.db_id = dbResult.page_pk;
        }

        this.walkNode(startNode);

        console.log(":)");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  walkNode(node: ReteNode) {
    if (node.data.walked) {
      return;
    }

    node.data.walked = true;

    const output = node.outputs.get("page");

    if (output) {
      const incoming = node;

      for (const connection of output.connections) {
        const outgoing = connection.input.node as ReteNode;

        this.persistNodeConnection(incoming, outgoing);
        this.walkNode(connection.input.node as ReteNode);
      }
    }
  }

  persistNodeConnection(incoming: ReteNode, outgoing: ReteNode) {
    const dbConnection = this.convertConnectionFromReteToDB(incoming, outgoing);

    PostOne<any>(`page_connection`, dbConnection)
      .then((result: any) => {
        console.log("yiha");
      })
      .catch((err) => {
        console.log(err);
      });
  }

  convertConnectionFromReteToDB(incoming: ReteNode, outgoing: ReteNode) {
    const incomingPage = incoming.data.db_id;
    const outgoingPage = outgoing.data.db_id;

    return {
      connection_id: uuidv4(),
      created_at: CreateNowTimestamp(),
      incoming_page: incomingPage,
      outgoing_page: outgoingPage,
    };
  }
}
</script>

<style lang='scss'>
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
</style>

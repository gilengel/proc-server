<template>
  <div style="width: 100%">
    <h1 v-if="!page.data">Something went wrong loading the view :(</h1>

    <grid-layout
      v-else
      :layout.sync="page.data.widgets"
      :col-num="12"
      :row-height="30"
      :is-draggable="draggable"
      :is-resizable="resizable"
      :vertical-compact="true"
      :use-css-transforms="false"
      :margin="[0, 0]"
      class="noselect"
    >
      <grid-item
        v-for="widget in page.data.widgets"
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
          :draggable="false"
          :is-draggable="draggable"
          :is-resizable="resizable"
          v-bind="widget.properties"
        />
      </grid-item>
    </grid-layout>

  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Page } from "./flow/Page";
import { GetOne, PAGES_URL } from "../models/Backend";
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
import { GridLayout, GridItem } from "vue-grid-layout";

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
  name: "DynamicPage",

  components: {
    GridLayout,
    GridItem,
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
export default class DynamicPage extends Vue {
  @Prop() readonly page!: Page;

  @Prop({ default: false }) readonly resizable!: boolean;
  @Prop({ default: false }) readonly draggable!: boolean;

  //page?: Page;
  layout: View | {} = {};

  mounted() {
    /*
    const pageId = this.$route.params.id;

    GetOne<Page>(`${PAGES_URL}/${pageId}`)
      .then((page) => {
        this.page = Object.assign({}, this.page, page);
        if (page.data) {
          this.layout = Object.assign({}, this.layout, page.data);
          console.log(this.layout);
        }
      })
      .catch((e) => {
        this.$q.notify({
          type: "error",
          message: e,
        });
      });
      */
  }
}
</script>

<style lang="scss" scoped>
.q-btn {
  color: $primary;
}

label {
  color: white;
}

form {
  padding: 1em;
}

.blueprint-column {
  padding-left: 1em;
  padding-right: 1em;
}
</style>

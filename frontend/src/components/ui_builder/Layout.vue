<template>
  <div class="col-10 drop-zone" ref="container">
    <template v-for="(row, row_index) in model.rows">
      <LayoutRow
        draggable
        dataKey="itemId"
        dataValue="Row"
        :dropTargetClass="['drop-zone', 'layout-row-divider']"
        :model="row"
        :rowIndex="row_index"
        :key="row_index"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from "vue-property-decorator";
import { mixins } from "vue-class-component";

import LayoutRow from "components/ui_builder/LayoutRow.vue";
import LayoutColumn from "components/ui_builder/LayoutColumn.vue";

import { Drop } from "../../mixins/Drop";

import { Grid, ElementType } from "../../models/Grid";

@Component({
  name: "Layout",

  components: {
    Layout,
    LayoutRow,
    LayoutColumn,
  },
})
export default class Layout extends mixins(Drop) {
  @Prop() model!: Grid;

  drop(evt: DragEvent) {
    if (evt.dataTransfer === null) {
      return;
    }

    const itemId = evt.dataTransfer.getData("itemId");

    if (itemId === ElementType.Row) {
      let index = -1;
      for (let [
        i,
        node,
      ] of (evt.target as HTMLElement).parentElement?.childNodes.entries()) {
        if (node === evt.target) {
          index = i - 1;
        }
      }
      index /= 2;
      index += 1;

      if (index == -1) {
        index = this.model.rows.length;
      }
      this.model.rows.splice(index, 0, {
        columns: [
          { width: 4, element: null },
          { width: 4, element: null },
          { width: 4, element: null },
        ],
      });
    }

    this.rows += 1;
  }
}
</script>

<style lang="scss" scoped>
.drop-zone {
  //border: solid 4px salmon;
}

.layout-row {
  margin-left: 10em;
}
</style>

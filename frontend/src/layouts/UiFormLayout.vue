<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white vue-draggable-handle">
          <q-toolbar-title>View Builder</q-toolbar-title>
        </q-toolbar>
        <div class="row">
          <div class="col-2"></div>
          <div class="col-8">
            <div class="ui_preview">
              <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
                <div
                  v-for="(row, row_index) in model.rows"
                  class="row"
                  :key="row_index"
                >
                  <LayoutColumn
                    v-for="(column, column_index) in row.columns"
                    v-bind:editable="false"
                    :key="column_index"
                    :class="columnClass(column)"
                    :row="row_index"
                    :column="column_index"
                    :max-column="row.columns.length"
                    :width="column.width"
                    :max-row="model.rows.length"
                  >
                    <div
                      v-if="
                        column.element !== null &&
                        column.element.type === 'Text'
                      "
                    >
                      <label>
                        {{ getValueOfAttribute(column.element, "label") }}
                      </label>
                      <q-input
                        dark
                        placeholder="Text"
                        :type="getValueOfAttribute(column.element, 'type')"
                        :rules="[val => !!val || 'Field is required']"
                        v-model="column.element.value"
                      />
                    </div>

                    <div
                      v-if="
                        column.element !== null &&
                        column.element.type === 'Button'
                      "
                    >
                      <q-btn
                        dark
                        :flat="getValueOfAttribute(column.element, 'isHighlighted') !== 'true'"
                        :label="getValueOfAttribute(column.element, 'label')"
                        :icon="getValueOfAttribute(column.element, 'icon')"
                        :type="getValueOfAttribute(column.element, 'type')"
                      />
                    </div>
                  </LayoutColumn>
                </div>
              </q-form>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import LayoutColumn from "../components/ui_builder/LayoutColumn.vue";

import IModel from "../store/Model";
import { Getter, Action } from "vuex-class";

import axios from "axios";

import {
  Element,
  ElementType,
  Column,
  Grid,
  ServerResponse,
} from "./FormModel";

interface FormElement {
  identifier: String;
  value: String;
}

@Component({
  name: "MainLayout",

  components: {
    LayoutColumn,
  },
})
export default class UiBuilderLayout extends Vue {
  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  model: Grid = { rows: [{ columns: [] }] };

  formModel: Array<FormElement> = new Array();

  accept: boolean = false;

  @Getter("model")
  getModel!: (uuid: string) => IModel;

  mounted() {
    this.loadForm();
  }

  /** Calls the server backend to receive the layout json file */
  private loadForm() {
    axios
      .request<Grid>({
        url: "http://localhost:8000/form/load/123",
        transformResponse: (r: ServerResponse) => r.data,
      })
      .then((response) => {
        this.model = Object.assign({}, JSON.parse(response.request.response));
        for (const row of this.model.rows) {
          for (const column of row.columns) {
            if (column.element !== null) {
              column.element = Object.assign({}, column.element, {
                value: "SomeValue",
              });
            }
          }
        }
      });
  }

  private getValueOfAttribute(element: Element, name: String): any {
    const attribute = element.attributes.find(
      (attribute) => attribute.name === name
    );

    return attribute === undefined ? undefined : attribute.value;
  }

  onSubmit() {
    const formVariables = new Map<String, String>();
    for (const row of this.model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
          const attribute = column.element.attributes.find(
            (attribute) => attribute.name === "variable"
          );

          if (attribute) {
            formVariables.set(attribute.value, column.element.value as String);
          }
        }
      }
    }
    console.log(formVariables);
  }

  onReset() {
    for (const row of this.model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
          column.element.value = undefined;
        }
      }
    }
  }

  columnClass(column: Column) {
    let colClass = "blueprint-column col";

    if (column.width) {
      colClass += `-${column.width}`;
    }

    return colClass;
  }
}
</script>

<style lang='scss'>
.blueprint-column {
  position: relative;
  border-radius: 2px;
  margin: 0.25em;

  display: flex;
  min-height: 4em;

  justify-content: center;
  align-items: center;
}
</style>

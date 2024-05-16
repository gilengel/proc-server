<template>
  <Widget
    title="Form"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <div v-for="(row, row_index) in model.rows" class="row" :key="row_index">
        <div
          v-for="(column, column_index) in row.columns"
          :class="columnClass(column)"
        >
          <div v-if="column.element !== null && column.element.type === 'Text'">
            <label>
              {{ getValueOfAttribute(column.element, "label") }}
            </label>
            <q-input
              
              placeholder="Text"
              :type="getValueOfAttribute(column.element, 'type')"
              v-model="column.element.value"
            />
          </div>

          <div
            v-if="column.element !== null && column.element.type === 'Button'"
          >
            <q-btn
              v-if="getValueOfAttribute(column.element, 'hasIcon') === 'true'"
              :flat="
                getValueOfAttribute(column.element, 'isHighlighted') !== 'true'
              "
              :label="getValueOfAttribute(column.element, 'label')"
              :icon="getValueOfAttribute(column.element, 'icon')"
              :type="getValueOfAttribute(column.element, 'type')"
            />
            <q-btn
              v-else
              :flat="
                getValueOfAttribute(column.element, 'isHighlighted') !== 'true'
              "
              :label="getValueOfAttribute(column.element, 'label')"
              :type="getValueOfAttribute(column.element, 'type')"
            />
          </div>
        </div>
      </div>
    </q-form>
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import { Component } from "vue-property-decorator";

import IModel from "../store/Model";
import { Getter, Action } from "vuex-class";

import EventBus, { ADD_MODEL } from "components/flow/FlowEventBus"

import axios from "axios";

import {
  Element,
  ElementType,
  Column,
  Grid,
  ServerResponse,
} from "../layouts/FormModel";

@Component({
  name: "FormWidget",
})
export default class FormWidget extends Widget {
  @Action("updateModel")
  updateModel!: (params: IModel) => void;

  model: Grid = { rows: [{ columns: [] }] };

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
              if (column.element.value === undefined) {
                const type = this.getValueOfAttribute(column.element, "type");
                if (type === "text") {
                  column.element.value = Math.random().toString().substr(2, 8);
                } else if (type === "date") {
                  column.element.value = "2021-04-05";
                } else if (type === "email") {
                  column.element.value = `${Math.random()
                    .toString()
                    .substr(2, 4)}@${Math.random()
                    .toString()
                    .substr(2, 4)}.com`;
                }
              }
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

  private extractFormVariables(): { valid: boolean; variables: {} } {
    const variablesForm = {};
    let validForm = true;

    for (const row of this.model.rows) {
      for (const column of row.columns) {
        if (column.element !== null) {
          const attribute = column.element.attributes.find(
            (attribute) => attribute.name === "variable"
          );

          if (attribute) {
            variablesForm.attribute.value = column.element.value;

            if (column.element.value === undefined) {
              validForm = false;
            }
          }
        }
      }
    }

    return {
      valid: validForm,
      variables: variablesForm,
    };
  }

  onSubmit() {
    const formVariables = {}; // = new Map<String, String>();

    const formValidation = this.extractFormVariables();

    if (formValidation.valid) {
      axios
        .post("http://localhost:8000/users", formValidation.variables)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });

      this.updateModel({
        uuid: this.uuid,
        model: formValidation.variables,
      });

      EventBus.$emit(ADD_MODEL, formVariables);
    }
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

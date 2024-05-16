<template>
  <Widget
    title="Table"
    @remove-widget="removeWidget"
    :resizable="resizable"
    :draggable="draggable"
    :deletable="deletable"
  >
    <q-table
      v-if="model"
      :columns="columns"
      :data="model.data"
      :pagination="pagination"
      row-key="id"
      flat
      color="amber"
    />
  </Widget>
</template>

<script lang="ts">
import Widget from "./Widget.vue";
import { Component } from "vue-property-decorator";
import axios from "axios";
import { date } from "quasar";
import { Getter } from "vuex-class";

interface TableRow {
  name: string;
  align: string;
  label: string;
  field: string;
  sortable: boolean;
}

interface TableModel {
  columns: Array<string>;
}

@Component({
  name: "TableWidget",
})
export default class TableWidget extends Widget {
  @Getter("model")
  getModel!: (uuid: string) => {};

  get model() {
    return this.getModel(this.uuid);
  }

  pagination = {
    rowsPerPage: 10,
  };

  columns = [
    // array of Objects
    { name: "id", label: "ID", field: "id", sortable: false },
    { name: "name", label: "Name", field: "name", sortable: false },
    { name: "address", label: "Address", field: "address", sortable: false },
    { name: "email", label: "Email", field: "email", sortable: false },
    //{ name: 'createdAt', label: 'Created At', field: 'createdAt', sortable: true, format: val => val },
    {
      name: "birth_date",

      // label for header
      label: "Birth Date",

      // row Object property to determine value for this column
      field: "birthDate",
      // OR field: row => row.some.nested.prop,

      // (optional) alignment
      align: "left",

      // (optional) tell QTable you want this column sortable
      sortable: true,

      // function return value:
      //   * is less than 0 then sort a to an index lower than b, i.e. a comes first
      //   * is 0 then leave a and b unchanged with respect to each other, but sorted with respect to all different elements
      //   * is greater than 0 then sort b to an index lower than a, i.e. b comes first

      // (optional) you can format the data with a function
      format: (val: any, row: any) => val,
      // one more format example:
      // format: val => val
    },
  ];
}
</script>

<style lang="scss">
.q-table__container {
  height: 100%;
}
</style>

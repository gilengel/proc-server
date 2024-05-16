import { StringTransform } from './../models/String';
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Grid, Row, Column, Element, ElementAttribute, ElementConnection, Point } from '../models/Grid'
import { v4 as uuidv4 } from "uuid";
import { ElementType } from 'src/layouts/FormModel';
import { ElementAttributeType } from 'src/models/Grid'

import Vue from 'vue'

export function createTextElement(): Element {
  const widgetAttributes = new Array<ElementAttribute>();

  widgetAttributes.push({
    name: "variable",
    type: ElementAttributeType.String,
    value: "Some_text",
  });
  widgetAttributes.push({
    name: "label",
    type: ElementAttributeType.String,
    value: "Some text",
  });
  widgetAttributes.push({
    name: "type",
    type: ElementAttributeType.String,
    value: "text",
  });
  widgetAttributes.push({
    name: "withLabel",
    type: ElementAttributeType.Boolean,
    value: true,
  });

  return {
    uuid: uuidv4(),
    type: ElementType.Text,
    attributes: widgetAttributes,
    classList: [],
    inputs: [
      {
        identifier: 'text',
        type: ElementAttributeType.String
      }
    ],
    outputs: [
      {
        identifier: 'text',
        type: ElementAttributeType.String
      }
    ]
  }
}

const DefaultGrid = {
  rows: [
    {
      columns: [
        { width: 4, element: null },
        { width: 8, element: null },
      ],
    },

    {
      columns: [
        { width: 4, element: null },
        { width: 4, element: null },
        { width: 4, element: null },
      ],
    },

    {
      columns: [
        { width: 6, element: null },
        { width: 6, element: null },
      ],
    },
  ],
};

@Module
export default class GridModulue extends VuexModule {
  private _grid: Grid | null = DefaultGrid;

  private _connections: Array<ElementConnection> = [];

  get grid(): Grid | null {
    return this._grid;
  }

  get connections(): Array<ElementConnection> {
    return this._connections;
  }

  @Mutation
  _addRow(row: Row) {
    this._grid?.rows.push(row)
  }

  @Mutation
  _deleteRow(rowIndex: number) {
    this._grid?.rows.splice(rowIndex, 1)
  }

  @Action({ commit: '_addRow' })
  addRow(row: Row) {
    return row;
  }

  @Action({ commit: '_deleteRow' })
  deleteRow(rowIndex: number) {
    return rowIndex;
  }

  @Action({ commit: '_deleteColumn', rawError: true })
  deleteColumn(params: { row: Row, columnIndex: number }) {
    return params
  }

  @Mutation
  _splitColumn(param: { row: Row, columnIndex: number }) {
    const colSize = param.row.columns[param.columnIndex].width / 2;

    const leftSize = Math.floor(colSize);
    const rightSize = Math.ceil(colSize);

    param.row.columns[param.columnIndex].width = leftSize;

    param.row.columns.splice(param.columnIndex, 0, {
      width: rightSize,
      element: null,
    });
  }

  @Action({ commit: '_splitColumn', rawError: true })
  splitColumn(params: { row: Row, columnIndex: number }) {
    return params
  }


  @Mutation
  _deleteColumn(param: { row: Row, columnIndex: number }) {
    const colSize = param.row.columns[param.columnIndex].width;

    const isLastColumn = param.columnIndex == param.row.columns.length - 1;

    param.row.columns.splice(param.columnIndex, 1);
    param.row.columns[
      isLastColumn ? param.columnIndex - 1 : param.columnIndex
    ].width += colSize;
  }

  @Mutation
  _updateColumnWidth(param: { column: Column, newWidth: number }) {
    param.column.width = param.newWidth
  }

  @Action({ commit: '_updateColumnWidth', rawError: true })
  updateColumnWidth(params: { column: Column, newWidth: number }) {
    return params
  }

  @Mutation
  _updateElementAttributes(param: { element: Element, name: string, value: any }) {
    const attribute = param.element.attributes.find(attribute => attribute.name === param.name);

    if (attribute) {
      attribute.value = param.value;
    }
  }

  @Action({ commit: '_updateElementAttributes', rawError: true })
  updateElementAttributes(param: { element: Element, name: string, value: any }) {
    return param
  }

  @Mutation
  _addToClassList(param: { element: Element, class: string }) {
    param.element.classList.push(param.class);
  }

  @Action({ commit: '_addToClassList' })
  addToClassList(param: { element: Element, class: string }) {
    return param
  }

  @Mutation
  _removeFromClassList(param: { element: Element, class: string }) {
    const index = param.element.classList.findIndex((e: string) => e === param.class)


    if (index !== -1) {
      param.element.classList.splice(index, 1)
    }
  }

  @Action({ commit: '_removeFromClassList' })
  removeFromClassList(param: { element: Element, class: string }) {
    return param
  }

  @Mutation
  _unlinkTwoElements(param: { identifier: string, start: Element, end: Element }) {
    const startIndex = param.start.outputs?.findIndex(pin => pin.identifier === param.identifier)
    const endIndex = param.end.inputs?.findIndex(pin => pin.identifier === param.identifier)

    const connection = param.start.outputs[startIndex].connection as ElementConnection;
    const connectionIndex = this._connections.findIndex(v => v.uuid === connection.uuid)
    this._connections.slice(connectionIndex, 1)

    Vue.set(param.start.outputs[startIndex], 'connection', null)
    Vue.set(param.end.inputs[endIndex], 'connection', null)


  }

  @Action({ commit: '_unlinkTwoElements' })
  unlinkTwoElements(param: { identifier: string, start: Element, end: Element }) {
    return param
  }

  @Mutation
  _linkTwoElements(param: { identifier: string, start: Element, end: Element }) {
    const connection: ElementConnection = {
      uuid: uuidv4(),
      input: param.start.uuid,
      output: param.end.uuid,
      value: '',
      transform: []
    }

    const startIndex = param.start.outputs?.findIndex(pin => pin.identifier === param.identifier)
    const endIndex = param.end.inputs?.findIndex(pin => pin.identifier === param.identifier)

    Vue.set(param.start.outputs[startIndex], 'connection', connection)
    Vue.set(param.end.inputs[endIndex], 'connection', connection)

    this._connections.push(connection)
  }

  @Action({ commit: '_linkTwoElements' })
  linkTwoElements(param: { identifier: string, start: Element, end: Element }) {
    return param
  }

  @Mutation
  _setConnectionValue(param: { connection: ElementConnection, value: any }) {

    const connection = this._connections.find(c => c.uuid === param.connection.uuid)
    if (!connection) {
      return
    }

    connection.value = param.value
  }

  @Action({ commit: '_setConnectionValue' })
  setConnectionValue(param: { connection: ElementConnection, value: any }) {
    return param;
  }

  @Mutation
  _addConnectionTransformation(param: { connection: ElementConnection, transformation: StringTransform }) {
    const connection = this._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform.push(param.transformation)
  }

  @Action({ commit: '_addConnectionTransformation' })
  addConnectionTransformation(param: { connection: ElementConnection, transformation: StringTransform }) {
    return param;
  }

  @Mutation
  _setConnectionTransformations(param: { connection: ElementConnection, transformations: Array<StringTransform> }) {
    const connection = this._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform = param.transformations
  }

  @Action({ commit: '_setConnectionTransformations' })
  setConnectionTransformations(param: { connection: ElementConnection, transformations: Array<StringTransform> }) {
    return param;
  }

  @Mutation
  _removeConnectionTransformation(param: { connection: ElementConnection, index: number }) {
    const connection = this._connections.find(c => c.uuid === param.connection.uuid)

    if (!connection) {
      return
    }

    connection.transform.splice(param.index, 1)
  }

  @Action({ commit: '_removeConnectionTransformation' })
  removeConnectionTransformation(param: { connection: ElementConnection, index: number }) {
    return param;
  }

  @Mutation
  _addElementToColumn(param: { column: Column, element: Element }) {
    param.column.element = param.element
  }

  @Action({ commit: '_addElementToColumn', rawError: true })
  addElementToColumn(param: { column: Column, element: Element }) {
    return param
  }

  @Mutation
  _removeElementFromColumn(column: Column) {
    column.element = null;
  }

  @Action({ commit: '_removeElementFromColumn', rawError: true })
  removeElementFromColumn(column: Column) {
    return column
  }
}

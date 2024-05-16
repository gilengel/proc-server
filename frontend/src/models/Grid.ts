import { StringTransform } from './String';

export enum ElementType {
  Button = "Button",
  Text = "Text",
  Row = "Row",
  Heading = "Heading",
  Map = "Map"
}



export interface Element {
  uuid: string;
  type: ElementType;
  attributes: Array<ElementAttribute>;
  column?: Column;
  classList: Array<string>;

  inputs?: Array<ElementPin>;
  outputs?: Array<ElementPin>;
}

export interface ElementPin {
  type: ElementAttributeType,
  identifier: string,
  connection?: ElementConnection
  children: Array<ElementPin | ElementPin>
}

export interface Point {
  x: number;
  y: number;
}
export interface ElementConnection {
  uuid: string;
  input: string;
  output: string;

  value?: any;
  transform: Array<StringTransform>;
}

export enum ElementAttributeType {
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  Coolection = "Collection",
}

export interface ElementAttribute {
  name: string;
  type: ElementAttributeType;
  value: any;
}

export interface Column {
  width: number;
  element: Element | null;
  row?: Row;
}

export interface Row {
  columns: Array<Column>;
}

export interface Grid {
  rows: Array<Row>;
}

export enum Direction {
  Left = 0,
  Right = 1,
}

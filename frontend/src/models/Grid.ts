import { CustomAttributeOptionElements } from 'src/boot/ui-builder';
import { ElementPin, FlowElement } from 'src/components/flow/model';
import * as uuid from 'uuid';
/**
 * List of all available elements that can be used to create a page.
 *
 * If you need to add a new element just add it to this list and it will
 * automatically appear in the ui as the ui iterates over all the values
 * in this list on start.
 */
export enum ElementType {
  Button = 'Button',
  Text = 'Text',
  Heading = 'Heading',
  Map = 'Map',
  Image = 'Image',
}

const elementTypeKeys = Object.keys(ElementType);

export const ElementTypes = elementTypeKeys as ElementType[];

export class Element extends FlowElement<ElementType, ElementAttributeType> {
  constructor(
    public type: ElementType,
    public attributes: ElementAttribute[],
    inputs?: ElementPin<ElementAttributeType>[],
    outputs?: ElementPin<ElementAttributeType>[],
  ) {
    super(type, inputs, outputs);
    this.id = uuid.v4();
  }

  data(
    inputs: Record<string, unknown[]>,
  ): Promise<Record<string, unknown>> | Record<string, unknown> {
    for (const key of Object.keys(inputs)) {
      const attribute = this.attributes.find(
        (attribute) => attribute.name === key,
      );

      console.log('UPDATE');
      attribute!.value = inputs[key][0] as string | number;
    }

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(this.outputs)) {
      result[key] = this.attributes.find(
        (attribute) => attribute.name === key,
      )?.value;
    }

    return result;
  }
}

export interface Point {
  x: number;
  y: number;
}

export enum ElementAttributeType {
  Number = 'Number',
  String = 'String',
  Boolean = 'Boolean',
  Collection = 'Collection',
}

export type SimpleAttribute = {
  name: string;
  type: ElementAttributeType;
  value: string | number | boolean;
  component?: CustomAttributeOptionElements;
};

export type CollectionAttribute = {
  name: string;
  type: ElementAttributeType;
  options: string[];
  value: string;
  component?: CustomAttributeOptionElements;
};

export type ElementAttribute = SimpleAttribute | CollectionAttribute;

export interface Column {
  id: string;
  width: number;
  element?: Element;
  row?: Row;
}

export interface Row {
  id: string;
  columns: Array<Column>;
}

export interface Grid {
  id: string;
  rows: Array<Row>;
}

export enum Direction {
  Left = 0,
  Right = 1,
}

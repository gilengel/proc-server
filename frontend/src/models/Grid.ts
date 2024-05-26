import { CustomAttributeOptionElements } from 'src/boot/ui-builder';
import {
  ElementPin,
  FlowDirection,
  FlowElement,
} from 'src/components/flow/model';
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

export class Element<T extends string, S extends string> extends FlowElement<
  T,
  S
> {
  constructor(
    public type: T,
    public attributes: ElementAttribute[],
    inputs?: ElementPin<S>[],
    outputs?: ElementPin<S>[],
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

      if (key === 'value') {
        const result: Record<string, unknown> = {};

        for (const i of inputs[key]) {
          const input = i as Record<string, unknown>;
          const key = Object.keys(input)[0];
          const value = input[key];

          result[key] = value;
        }

        console.log(result);
      }

      attribute!.value = inputs[key][0] as string | number;
    }

    const result: Record<string, unknown> = {};
    for (const key of Object.keys(this.outputs)) {
      if (key === 'variable' || key === 'value') {
        continue;
      }
      result[key] = this.attributes.find(
        (attribute) => attribute.name === key,
      )?.value;
    }

    const variableName = this.attributes.find(
      (attribute) => attribute.name === 'variable',
    )?.value as string;

    const value = this.attributes.find(
      (attribute) => attribute.name === 'value',
    )?.value;

    const t: Record<string, unknown> = {};
    t[variableName] = value;
    result['value'] = t;

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

export type ElementAttribute = (SimpleAttribute | CollectionAttribute) & {
  direction?: FlowDirection;
};

export interface Column<T extends string, S extends string> {
  id: string;
  width: number;
  element?: Element<T, S>;
  row?: Row<T, S>;
}

export interface Row<T extends string, S extends string> {
  id: string;
  columns: Column<T, S>[];
}

export interface Grid<T extends string, S extends string> {
  id: string;
  rows: Row<T, S>[];
}

export enum Direction {
  Left = 0,
  Right = 1,
}

export enum FormInputOutput {
  Input = 'Input',
  Output = 'Output',
  Object = 'Object',
}

export type FormType = ElementType | FormInputOutput;

# Frontend

## Nomenclature

- Element: (Interactable) Widget that is displayed to the user. This can be a heading, text, button, image etc
- Attribute: The parts that specify the behaviour and apperance of an `Element`.

## UI Builder

The overall idea of the UI Builder component is to use build in TypeScript "magic" to automatically import the correct files at the correct positions and wire everything together.
This is only possible by using an experimental feature of vue called `<Suspense>` to allow async functions to be called inside a setup script. But let us start at the beginning.

## Models

UIs use a grid structure at there core.

```ts
export interface Grid {
  id: string;
  rows: Array<Row>;
}
```

A grid is represented by rows:

```ts
export interface Row {
  id: string;
  columns: Array<Column>;
}
```

and columns:

```ts
export interface Column {
  id: string;
  width: number;
  element: Element | null;
  row?: Row;
}
```

where each row can contain up to `12` columns.

Each column can contain one `Element` which is the one the user will see and interact with

```ts
export interface Element {
  uuid: string;
  type: ElementType;
  attributes: Array<ElementAttribute>;
  column?: Column;
  classList: Array<string>;

  inputs?: Array<ElementPin>;
  outputs?: Array<ElementPin>;
}
```

Elements can

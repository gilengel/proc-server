<template>
  <div class="column option-column">
    <h1 class="text-subtitle1">Button</h1>
    <div v-for="attribute in model.attributes" :key="attribute.name">
      <component
        :is="optionElement(attribute)"
        v-bind="optionProps(attribute)"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  CollectionAttribute,
  ElementAttribute,
  ElementAttributeType,
} from 'src/models/Grid';

import * as Option from './attributes';
import { IBaseElementProps } from './BaseElement';
import { getCustomAttributeOptionElement } from 'src/boot/ui-builder';

const props = defineProps<IBaseElementProps>();

function optionProps(attribute: ElementAttribute) {
  switch (attribute.type) {
    case ElementAttributeType.String:
    case ElementAttributeType.Boolean: {
      return {
        model: props.model,
        label: attribute.name,
        attributeKey: attribute.name,
      };
    }
    case ElementAttributeType.Collection: {
      if (!('options' in attribute)) {
        console.error(
          `☹️ the attribute "${attribute.name}" is of collection type but does not defines the options array.`,
        );
      }

      const a = attribute as CollectionAttribute;
      return {
        model: props.model,
        label: a.name,
        attributeKey: a.name,
        options: a.options,
      };
    }
  }

  return undefined;
}

function optionElement(attribute: ElementAttribute) {
  if (attribute.component) {
    return getCustomAttributeOptionElement(attribute.component);
  }

  switch (attribute.type) {
    case ElementAttributeType.String: {
      return Option.Text;
    }
    case ElementAttributeType.Boolean: {
      return Option.Toggle;
    }
    case ElementAttributeType.Collection: {
      return Option.Collection;
    }
  }

  return undefined;
}
</script>

<style scoped lang="scss">
.column {
  gap: 1em;
}
</style>

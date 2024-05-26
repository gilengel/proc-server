<template>
  <div class="icon-list">
    <q-virtual-scroll
      style="max-height: 300px"
      :items="icons.categories"
      separator
      v-slot="{ item }"
    >
      <div>
        <h2>{{ item.name }}</h2>

        <q-icon
          :name="icon.icon"
          v-for="icon of item.icons"
          :key="icon.name"
          @click="model = icon.icon"
        />
      </div>
    </q-virtual-scroll>
  </div>
</template>

<script setup lang="ts" generic="T extends string, S extends string">
import { useChangeableComputedAttributeModel } from 'src/composables/useChangeableComputedAttributeModel';
import { IOptionProps } from '.';
import icons from '../button/icons.json';

export type Icon = { name: string; icon: string };

const props = defineProps<IOptionProps<T, S>>();

const model = useChangeableComputedAttributeModel<T, S, string>(
  props.attributeKey,
  props.model,
);
</script>

<style scoped lang="scss">
.icon-list {
  padding-left: 0.5em;
  padding-right: 0.5em;

  border: 1px solid $border;
}

h2 {
  font-size: 1em;
  margin: 0;
  padding: 0;
  padding-top: 2em;
  padding-bottom: 1em;
  line-height: 1em;
  border-bottom: 1px solid $border;
}

i {
  font-size: 32px;
  padding: 0.5em;
}

i:hover {
  background-color: $primary;
  cursor: pointer;
}

.q-field {
  width: 100%;
}
</style>

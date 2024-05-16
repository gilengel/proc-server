<template>
  <div class="flow-dock">
    <q-toolbar>
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <div class="q-gutter-sm"></div>
    </q-toolbar>
    <q-list padding>
      <template v-for="category in nodes" v-bind:key="category.label">
        <q-item-label header>{{ category.label }}</q-item-label>

        <q-item
          v-for="component in category.components"
          :key="component.id"
          draggable="true"
          v-on:dragstart="dragstart(component.id, $event)"
        >
          <q-item-section avatar>
            <q-icon :name="component.icon" />
          </q-item-section>
          <q-item-section>{{ component.label }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { MetaFlowCategory } from './components/Index';

defineProps({
  title: String,
  nodes: Array as PropType<Array<MetaFlowCategory>>,
});
</script>

<style scoped></style>

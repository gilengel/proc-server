<template>
  <div class="widget">
    <q-toolbar class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title>{{ title }} {{deletable}}</q-toolbar-title>
      <q-btn v-if="deletable"
        flat
        round
        dense
        @click="removeWidget"
      >
        <q-icon name="las la-trash" />
      </q-btn>
    </q-toolbar>
    <div class="widget-content">
      <slot />
    </div>

    <q-toolbar v-if="resizable" class="bg-black text-white vue-draggable-handle">
      <q-toolbar-title />
      <q-icon
        name="las la-ruler-combined"
        class="vue-resizable-handle custom-handle"
      />
    </q-toolbar>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Widget'
})
export default class Widget extends Vue {
  @Prop({ default: 'Blank Widget' }) readonly title!: string;

  @Prop({ default: '' }) readonly uuid!: string;

  @Prop() readonly resizable!: boolean;
  @Prop() readonly draggable!: boolean;
  @Prop() readonly deletable!: boolean;

  removeWidget () {
    this.$emit('remove-widget', this.$props.uuid)
  }
}
</script>

<style lang="scss" scoped>
.widget {
  height: 100%;

  display: flex;
  flex-direction: column;
}

.widget-content {
  flex-grow: 2;

  height: 100%;
  overflow: hidden;
}

.vue-draggable-handle {
  position: relative !important;
  width: auto !important;
  padding: 0 !important;
}

.custom-handle  {
  font-size: 3em !important;
  color: white;
  margin-right: 6px;
}

span.vue-resizable-handle  {
  visibility: collapse;
}
</style>


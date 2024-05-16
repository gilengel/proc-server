<template>
  <div class="widget">
    <q-toolbar class="bg-black text-white">
      <q-toolbar-title>{{ title }}</q-toolbar-title>
      <q-space />
      <q-btn
        flat
        round
        dense
        icon="las la-search"
      />
    </q-toolbar>
    <div class="widget-content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'Options'
})
export default class Options extends Vue {
  @Prop({ default: 'Blank Widget' }) readonly title!: string;
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
}

</style>

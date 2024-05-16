<template>
    <q-toggle
      v-model="value"
      color="primary"
      label="Dark Mode"      
    />
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Style } from 'src/store/Style'
import { Getter, Action } from "vuex-class";

@Component
export default class StyleSelector extends Vue {
  @Action("setStyle")
  setStyle!: (params: Style) => void;

  value: boolean =  false;

  @Watch('value')
  onChildChanged(val: boolean, oldVal: boolean) {      
      this.$q.dark.set(val)
  }
}
</script>

<style lang="scss" scoped>
.widget {
  height: 100%;

  display: flex;
  flex-direction: column;
  //background: rgba($dark-page, 0.9);

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


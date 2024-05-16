<template>
  <!--<q-btn flat round :color="color" :icon="icon" @click="checked = !checked"/>-->
  <q-btn flat round dark :color="checked ? 'primary' : 'white'" :icon="_icon" @click="checked = !checked" />

</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from "vue-property-decorator";

@Component({
  name: "ToggleButton",
})
export default class ToggleButton extends Vue {
  @Prop({
    validator(x) {
      return typeof x === "string";
    },
  })
  icon?: string;

  get _color() {

    return this.checked ? this["selected-color"] : this.color
  }

  get _icon() {

    if (this.icon) {
      return this.icon;
    }

    return undefined;
  }

  @Prop({
    validator(x) {
      return typeof x === "string" && x.length > 0;
    },
  })
  color!: string;

  @Prop({
    validator(x) {
      return typeof x === "string" && x.length > 0;
    },
  })
  "selected-color"!: string;

  @Prop({
    validator(x) {
      return typeof x === "string" && x.length > 0;
    },
  })
  label!: string;

  @VModel({ type: Boolean }) checked!: boolean;
}
</script>

<style lang="scss">
.toolbar {
  position: relative;
  display: flex;
  justify-content: center;
  border-radius: 6px;

  .q-btn {
    margin: 0;
    transform: translateY(-50%);
    position: relative;
    display: block;
  }

  $margin: 8px;
  .q-btn::before {
    content: "";
    position: absolute;
    border-radius: 50%;
    border: solid $margin $dark-page;
    height: calc(100% + #{$margin} * 2);
    top: -$margin;
    left: -$margin;
    width: calc(100% + #{$margin} * 2);
  }
}
</style>

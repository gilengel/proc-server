<template>
  <div class="column option-column">
    <h2 class="text-subtitle2">{{ group.label }}</h2>

    <div class="row">
      <q-icon
        :name="icon"
        v-for="(icon, icon_index) in group.icons"
        :key="icon_index"
        :class="{ selected: selected(icon) }"
        @click="setIcon(icon)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class IconList extends Vue {
  @Prop() group!: null;

  @Prop({
    validator(x) {
      return typeof x === "string";
    },
  })
  icon!: string;

  iconInput: string = "";

  mounted() {
    this.iconInput = this.icon;
  }

  selected(icon: string) {
    return icon === this.iconInput;
  }

  setIcon(icon: string) {
    this.iconInput = icon;

    this.$emit("setIcon", icon);
  }
}
</script>

<style lang="scss" scoped>
.selected {
  color: $primary;
}
</style>

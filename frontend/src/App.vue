<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "App",
});
</script>

<style lang="scss">
.body--light {
  background: $grey-1;

  .q-toolbar {
    background: darken($grey-1, 10%);
  }
}

body.body--dark {
  background: #22252b;

  .q-toolbar {
    background: darken(#22252b, 5%);
  }
}

#q-app {
  height: 100vh;
}

.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.selected {
  outline: solid $primary 2px;
  transition: outline 0.3s;
}

.linked {
  outline: solid $accent 4px;
  transition: outline 0.3s;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;

  z-index: 0;
}
</style>

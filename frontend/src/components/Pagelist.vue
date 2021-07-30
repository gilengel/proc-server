<template>
  <h1>Page List</h1>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageList',
  props: {
  },

  setup() {
      const fetch = () => {
          return []
      }

      return {
          fetch
      }
  }
})
</script>

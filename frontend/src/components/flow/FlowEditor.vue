<template>
  <div ref="editor"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createEditor } from './editor';

const editor = ref(null);

onMounted(() => {
  createEditor(editor.value!);
});
</script>

<style scoped lang="scss">
div {
  width: 100%;
  height: 800px;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>

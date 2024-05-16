<template>
  <div class="editor" ref="editor"></div>
</template>

<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { createEditor } from './FlowGraph';

const editor: Ref<HTMLElement | null> = ref(null);

onMounted(() => {
  if (!editor.value) {
    console.error('editor element does not exists');
  }
  createEditor(editor.value as HTMLElement);
});
</script>

<style scoped lang="scss">
.editor {
  height: 100vh;

  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>

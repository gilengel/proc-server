<template>
  <div>
    <h1>Page List</h1>
    <h2 v-if="persistedPages.length == 0">
      You don't have any pages yet. You can start by
      <button id="new_page_link" @click="showNewPageDialog">
        creating a new page right here.
      </button>
    </h2>
    <q-list bordered separator v-else>
      <q-item
        clickable
        v-ripple
        v-for="page in persistedPages"
        :key="page.page_id"
      >
        <q-item-section>{{ page.name }}</q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { storeKey } from '../store';
import { mapGetters, useStore } from 'vuex';

export default defineComponent({
  name: 'PageList',
  props: {},

  computed: {
    ...mapGetters({ persistedPages: 'Page/persistedPages' }),
  },

  setup() {
    const store = useStore(storeKey);

    const isNewPageDialogVisisble = ref(false);

    const showNewPageDialog = () => {
      isNewPageDialogVisisble.value = true;
    };

    return {
      store,
      isNewPageDialogVisisble,
      showNewPageDialog,
    };
  },
});
</script>

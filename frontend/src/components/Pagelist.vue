<template>
  <div>
    <h1>Page List</h1>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="accent" id="new_page_link" @click="showNewPageDialog" />
    </q-page-sticky>

    <h2 v-if="persistedPages.length == 0">
      You don't have any pages yet. You can start by
    </h2>
    <q-list id="lst__pages" bordered separator v-else>
      <q-item
        clickable
        v-ripple
        v-for="(page, index) in persistedPages"
        :key="page.page_id"
      >
        <q-item-section>{{ page.name }}</q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn
              :id="`btn__delete_page_${index}`"
              class="gt-xs"
              size="12px"
              flat
              dense
              round
              icon="delete"
              @click="
                selectedPageId = page.page_id;
                showDeletePageDialog();
              "
            />
          </div>
        </q-item-section>
      </q-item>
    </q-list>

    <q-dialog v-model="isNewPageDialogVisisble" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Create New Page</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input
            for="txt__new_page_name"
            dense
            v-model="newPageName"
            autofocus
            @keyup.enter="createNewPage"
            @keyup.esc="isNewPageDialogVisisble = false"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn id="btn__cancel_create_page" flat label="Cancel" v-close-popup />
          <q-btn
            id="btn__create_page"
            flat
            label="Create Page"
            v-close-popup
            @click="createNewPage"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="isDeletePageDialogVisisble" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Permanently Delete Page</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>
            Are you sure that you want to delete the page? Be aware that this
            action cannot be undone"
          </p>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            id="btn__delete_page"
            flat
            label="Confirm Deletion"
            v-close-popup
            @click="deletePersistedPagesById(selectedPageId)"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { StateInterface, storeKey } from '../store';
import { mapGetters, Store, useStore } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { NewPage } from '../models/Page';
import { CreateNowTimestamp } from '../models/Date';

async function updateCachedPagesInState(store: Store<StateInterface>) {
  await store.dispatch('Page/fetchAllFromBackend');
}

export default defineComponent({
  name: 'PageList',
  props: {},

  computed: {
    ...mapGetters({ persistedPages: 'Page/persistedPages' }),
  },
  setup() {
    const store = useStore(storeKey);

    updateCachedPagesInState(store).catch((e) => console.error(e));

    const isNewPageDialogVisisble = ref(false);
    const newPageName = ref('');

    const showNewPageDialog = () => {
      isNewPageDialogVisisble.value = true;
    };

    const createNewPage = async () => {
      isNewPageDialogVisisble.value = false;

      const payload: NewPage = {
        page_id: uuidv4(),
        name: newPageName.value,
        created_at: CreateNowTimestamp(),
      };

      await store.dispatch('Page/persistNewPage', payload);
    };

    const isDeletePageDialogVisisble = ref(false);
    const selectedPageId = ref('');
    selectedPageId.value = '';

    const showDeletePageDialog = () => {
      isDeletePageDialogVisisble.value = true;
    };

    const deletePersistedPagesById = async (page_id: string) => {
      isDeletePageDialogVisisble.value = false;

      console.log(page_id);

      await store.dispatch('Page/deletePageById', page_id);
    };

    return {
      store,
      isNewPageDialogVisisble,
      newPageName,
      isDeletePageDialogVisisble,
      showNewPageDialog,
      createNewPage,
      showDeletePageDialog,
      deletePersistedPagesById,
    };
  },
});
</script>

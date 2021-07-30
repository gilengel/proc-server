<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          Quasar App
        </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>



    <q-page-container>
      <page-list />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

import PageList from '../components/Pagelist.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    PageList
  },

  setup () {
    return {
    }
  }
})
</script>

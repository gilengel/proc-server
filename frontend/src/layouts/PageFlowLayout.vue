<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar class="bg-black text-white">
          <q-toolbar-title v-if="page">{{ page.name }}</q-toolbar-title>
        </q-toolbar>

        <div class="row" style="height: 400px">
          <DynamicPage :page="page" />
        </div>
        <div class="row">
          <div class="col">
            <q-btn
              v-if="previousConnection.incoming_id"
              :label="previous"
              color="primary"
              @click="gotoAnotherPage(previousConnection.incoming_id)"
            />
          </div>
          <div class="col"></div>
          <div class="col">
            <q-btn
              v-if="follwingConnection.outgoing_id !== $route.params.id"
              :label="next"
              color="primary"
              @click="gotoAnotherPage(follwingConnection.outgoing_id)"
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import { GetMultiple, GetOne, PAGES_URL } from "../models/Backend";
import { Page } from "../components/flow/Page";

import DynamicPage from "../components/DynamicPage.vue";

interface RouterPair {
  incoming_id?: string;
  outgoing_id?: string;
  incoming_name?: string;
  outgoing_name?: string;
}

@Component({
  name: "PageFlowLayout",

  components: {
    DynamicPage,
  },
})
export default class PageFlowLayout extends Vue {
  gotoAnotherPage(id: string) {
    this.$router.push(`${id}`);
  }

  previousConnection: RouterPair = {};
  follwingConnection: RouterPair = {};

  page: Page | {} = {};

  @Watch("$route.params.id")
  onModelChanged(val: string) {
    this.getConnectionsFromBackend();
  }

  private getConnectionsFromBackend() {
    const currentPageId = this.$route.params.id;
    GetOne<Page>(`${PAGES_URL}/current/${currentPageId}`).then((page) => {
      this.page = Object.assign({}, this.page, page);
    });
    GetMultiple<RouterPair>(`pages/following/${this.$route.params.id}`).then(
      (pairs) => {
        console.log(pairs);
        if (pairs && pairs.length > 0) {
          this.follwingConnection = Object.assign(
            {},
            this.follwingConnection,
            pairs[0]
          );
        }
      }
    );
    GetMultiple<RouterPair>(`pages/previous/${this.$route.params.id}`).then(
      (pairs) => {
        if (pairs && pairs.length > 0) {
          this.previousConnection = Object.assign(
            {},
            this.previousConnection,
            pairs[0]
          );
        }
      }
    );
  }

  mounted() {
    this.getConnectionsFromBackend();
  }

  get previous() {
    const connection = this.previousConnection;

    let label = "Previous To";

    if (connection.incoming_name) {
      label += ` - ${connection.incoming_name}`;
    }

    return label;
  }

  get next() {
    const connection = this.follwingConnection;

    let label = "Next To";

    if (connection.outgoing_name) {
      label += ` - ${connection.outgoing_name}`;
    }

    return label;
  }
}
</script>

<style lang='scss'>
</style>

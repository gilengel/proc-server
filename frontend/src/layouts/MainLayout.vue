<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <q-toolbar>
          <q-toolbar-title>procmap</q-toolbar-title>

          <StyleSelector />
        </q-toolbar>

        <div class="row">
          <div class="col">
            <h1 class="text-h1">Workflows</h1>
            <q-select
              dark
              v-model="selectedPage"
              :options="pages"
              label="Standard"
              option-value="page_id"
              option-label="name"
            />

            <span class="text-subtitle1 text-white">Change</span>
            <q-list dark bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="flow in flows"
                :key="flow.flow_pk"
                @click="rerouteToFlowBuilder(flow.flow_id)"
              >
                <q-item-section>
                  <q-item-label>{{ flow.name }}</q-item-label>
                  <q-item-label caption>{{ flow.created_at }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              label="New Flow"
              color="primary"
              style="
                background: salmon !important;
                color: rgb(30, 30, 30) !important;
                margin-top: 8px;
                margin-bottom: 8px;
              "
              @click="createNewFlow = true"
            />
          </div>
          <div class="col">
            <h1 class="text-h1">Pages</h1>
            <q-list dark bordered separator>
              <q-item
                clickable
                v-ripple
                v-for="page in pages"
                :key="page.page_pk"
              >
                <q-item-section @click="rerouteToPageBuilder(page.page_id)">
                  <q-item-label>{{ page.name }}</q-item-label>
                  <q-item-label caption>{{ page.created_at }}</q-item-label>
                </q-item-section>
                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn
                      class="gt-xs"
                      flat
                      dense
                      round
                      icon="delete"
                      @click="toggleDeletePage(page)"
                    />
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <q-btn
              label="New Page"
              color="primary"
              style="
                background: salmon !important;
                color: rgb(30, 30, 30) !important;
                margin-top: 8px;
                margin-bottom: 8px;
              "
              @click="createNewPage = true"
            />
          </div>
        </div>

        <q-dialog v-model="deletePage">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Delete Page?</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <p>
                Do you really want to delete the page <b></b>? Be aware that is
                cannot be undone.
              </p>
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Permanently Delete"
                v-close-popup
                @click="confirmDeletePage(selectedPage)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="createNewFlow">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Create New Flow</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newFlowName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Create Flow"
                v-close-popup
                @click="createFlow"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>

        <q-dialog v-model="createNewPage">
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Create New Page</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="newPageName"
                autofocus
                @keyup.enter="prompt = false"
              />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Cancel" v-close-popup />
              <q-btn
                flat
                label="Create Page"
                v-close-popup
                @click="createPage"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";

import { v4 as uuidv4 } from "uuid";

import axios from "axios";

import { GetAllPages, NewPage, Page } from "components/flow/Page";

import StyleSelector from "components/StyleSelector.vue"

import { TempFlow } from "../models/TempFlow";
import {
  GetMultiple,
  DeleteOne,
  TEMP_FLOW_URL,
  PAGES_URL,
} from "../models/Backend";
import { CreateNowTimestamp } from "src/models/Date";

@Component({
  name: "MainLayout",

  components: {
      StyleSelector
  },
})
export default class MainLayout extends Vue {
  createNewFlow: boolean = false;
  createNewPage: boolean = false;
  deletePage: boolean = false;
  newFlowName: string = "";
  newPageName: string = "";

  selectedPage: Page | null = null;

  pages: Array<Page> = [];
  flows: Array<TempFlow> = [];

  get availablePageNames() {
    return this.pages.map((page) => page.name);
  }

  private getTempFlows() {
    GetMultiple<TempFlow>(TEMP_FLOW_URL)
      .then((flows) => (this.flows = flows))
      .catch((err) => {
        this.$q.notify({
          type: "error",
          message: "Could not reach backend",
        });
      });
  }

  getAllPages() {
    GetAllPages()
      .then((pages) => (this.pages = pages))
      .catch((reason) => {
        this.$q.notify({
          type: "error",
          message: "Could not reach backend",
        });
      });
  }
  created() {
    this.getTempFlows();
    this.getAllPages();
  }

  createFlow() {
    const hasName = this.newFlowName !== "";

    if (!hasName) {
      return;
    }

    const date = new Date().toJSON().slice(0, -1);
    const tempFlow = {
      flow_id: uuidv4(),
      name: this.newFlowName,
      created_at: date,
      data: {},
    };

    const self = this;
    axios
      .post("http://localhost:8000/temp_flow", tempFlow)
      .then(function (response) {
        const result = JSON.parse(response.request.response);

        self.rerouteToFlowBuilder(result.flow_id);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  createPage() {
    const hasName = this.newPageName !== "";

    if (!hasName) {
      return;
    }

    const newPage: NewPage = {
      page_id: uuidv4(),
      name: this.newPageName,
      created_at: CreateNowTimestamp(),
    };

    const self = this;
    axios
      .post("http://localhost:8000/pages", [newPage])
      .then(function (response) {
        const result = JSON.parse(response.request.response) as Array<Page>;

        console.assert(result.length > 0);
        self.rerouteToFlowBuilder(result[0].page_id);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  toggleDeletePage(page: Page) {
    this.deletePage = true;
    this.selectedPage = Object.assign({}, this.selectedPage, page);
  }

  confirmDeletePage(page: Page) {
    DeleteOne(PAGES_URL, page.page_pk)
      .then(() => this.getAllPages())
      .catch((err) => {
        this.$q.notify({
          type: "error",
          message: "Could not reach backend",
        });
      });
  }

  private rerouteToFlowBuilder(flowUuid: string) {
    this.$router.push(`page_flow_builder/${flowUuid}`);
  }

  private rerouteToPageBuilder(pageUuid: string) {
    this.$router.push(`page_builder/${pageUuid}`);
  }
}
</script>

<style lang='scss'>

h1 {
  font-size: 2em !important;
  color: white;
}

.q-banner {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
}

.vue-grid-item .resizing {
  opacity: 0.9;
}
</style>

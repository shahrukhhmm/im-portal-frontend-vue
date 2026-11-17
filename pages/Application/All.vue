<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab>All Applications</v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-btn class="float-right" color="primary" to="add">
          Add Application
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <table-standard
            grid
            :config="config"
            class="row-pointer"
            :items="Api.Application.all"
            :loading="Api.Application.loading"
            @click:row="
              (application) =>
                $router.push('/application/edit/' + application.id)
            "
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Application } from "@/repositories";
import { Api, AppStore } from "@/store";

@Component({ layout: "panel" })
export default class AllApplication extends Vue {
  Api = Api;

  tab = "";

  config = {
    headers: [
      { text: "Name", value: "name" },
      { text: "Thumbnail", value: "thumbnail", sortable: false },
      { text: "", value: "actions", sortable: false },
    ],
    actions: [
      {
        type: "edit",
        icon: "mdi-pencil",
        to: "/application/edit/[id]",
      },
      {
        type: "delete",
        icon: "mdi-delete",
        onClick: (Application: Application) => {
          AppStore.showDeleteConfirmationModal({
            deleteItemTitle: Application.name || "",
            deleteItem: Application,
            agreeButton: { callback: this.deleteApplication },
          });
        },
      },
    ],
    grid: {
      title: "name",
      Image: "thumbnail",
    },
  };

  mounted() {
    this.updateApplications();
  }

  updateApplications() {
    Api.Application.getAll();
  }

  deleteApplication(Application: Application) {
    Api.Application.delete(Application.id!).finally(this.updateApplications);
  }
}
</script>

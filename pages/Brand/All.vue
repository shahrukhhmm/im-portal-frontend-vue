<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab>All Brands</v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-btn class="float-right" color="primary" to="add"> Add Brand </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <table-standard
            grid
            :config="config"
            class="row-pointer"
            :items="Api.Brand.all"
            :loading="Api.Brand.loading"
            @click:row="(brand) => $router.push('/brand/edit/' + brand.id)"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Api, AppStore } from "@/store";
import { Brand } from "@/repositories";

@Component({ layout: "panel" })
export default class AllBrand extends Vue {
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
        to: "/brand/edit/[id]",
      },
      {
        type: "delete",
        icon: "mdi-delete",
        onClick: (Brand: Brand) => {
          AppStore.showDeleteConfirmationModal({
            deleteItemTitle: Brand.name || "",
            deleteItem: Brand,
            agreeButton: { callback: this.deleteBrand },
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
    this.updateBrands();
  }

  updateBrands() {
    Api.Brand.getAll();
  }

  deleteBrand(Brand: Brand) {
    Api.Brand.delete(Brand.id!).finally(this.updateBrands);
  }
}
</script>

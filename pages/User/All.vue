<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab>All Users</v-tab>
        </v-tabs>
      </v-col>
      <v-col>
        <v-btn class="float-right" color="primary" to="add"> Add User </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card>
          <table-standard
            :config="config"
            class="row-pointer"
            :items="Api.User.all"
            :loading="Api.User.loading"
            @click:row="(user) => $router.push('/user/edit/' + user.id)"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Api, AppStore } from "@/store";
import { User } from "@/repositories";

@Component({ layout: "panel" })
export default class AllUser extends Vue {
  Api = Api;

  tab = "";

  config = {
    headers: [
      { text: "First Name", value: "first_name", width: "15%" },
      { text: "Last Name", value: "last_name", width: "15%" },
      { text: "Email", value: "email" },
      { text: "Level", value: "level" },
      { text: "", value: "actions", sortable: false, width: 0 },
    ],
    actions: [
      {
        type: "edit",
        icon: "mdi-pencil",
        to: "/user/edit/[id]",
      },
      {
        type: "delete",
        icon: "mdi-delete",
        onClick: (User: User) => {
          AppStore.showDeleteConfirmationModal({
            deleteItemTitle: User.first_name + " " + User.last_name || "",
            deleteItem: User,
            agreeButton: { callback: this.deleteUser },
          });
        },
      },
    ],
  };

  mounted() {
    this.updateUsers();
  }

  updateUsers() {
    Api.User.getAll();
  }

  deleteUser(User: User) {
    Api.User.delete(User.id!).finally(this.updateUsers);
  }
}
</script>

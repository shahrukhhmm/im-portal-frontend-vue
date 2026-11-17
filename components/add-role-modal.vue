<template>
  <v-dialog v-model="showSynced" max-width="500px">
    <v-card>
      <v-card-title>
        Select Role
        <v-spacer />
        <v-btn icon @click="showSynced = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-btn
          block
          outlined
          elevation="0"
          :key="Role.id"
          color="primary"
          class="my-3 pa-6"
          v-for="Role in Api.Role.all"
          @click="submit(Role.id)"
        >
          {{ Role.name }}
        </v-btn>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Emit, Prop } from "vue-property-decorator";
import { Api } from "@/store";

@Component
export default class addRoleModal extends Vue {
  @PropSync("show", { type: Boolean }) showSynced!: Boolean;
  @Prop(Object) readonly data!: {
    app_id: number;
    brand_id: number;
  };
  Api = Api;

  mounted() {
    if (!Api.Role.all.length) Api.Role.getAll();
  }

  @Emit("submit")
  submit(role_id: number) {
    this.showSynced = false;
    return {
      brand_id: this.data.brand_id,
      app_id: this.data.app_id,
      role_id: role_id,
      access: 1,
    };
  }
}
</script>

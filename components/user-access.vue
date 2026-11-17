<template>
  <div v-if="userId" class="table">
    <v-row class="table-row">
      <v-col class="table-first-item py-2 mr-1 pa-0"> </v-col>
      <v-col
        v-for="Application in Api.Application.all"
        class="table-item mr-1 pa-0"
        :key="Application.id"
      >
        <h6>
          {{ Application.name }}
        </h6>
      </v-col>
    </v-row>
    <v-card
      v-for="Brand in Api.Brand.all"
      class="mb-2 table-rows"
      :key="Brand.id"
    >
      <v-row class="table-row">
        <v-col class="table-first-item py-2 mr-1 pa-0">
          <strong> {{ Brand.name }} </strong>
          <br />
          <small> {{ Brand.name }} </small>
        </v-col>
        <v-col
          v-for="Application in Api.Application.all"
          class="table-item mr-1 pa-0"
          :key="Application.id"
        >
          <!-- <v-btn small elevation="0" class="mt-2 px-1 role-btn" color="primary">
            Contact Center
          </v-btn> -->
          <v-btn
            small
            elevation="0"
            color="primary"
            class="mt-2 px-1 role-btn"
            :plain="!getRole(Application.id, Brand.id).id"
            @click="roleBtnClick(Application.id, Brand.id)"
          >
            {{ getRole(Application.id, Brand.id).name || "Add Role" }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
    <loading-overlay
      :show="Api.Application.loading || Api.Brand.loading || Api.Role.loading"
    />
    <add-role-modal
      :show.sync="roleModalShow"
      :data="selectedAppBrand"
      @submit="addRole"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { UserAccessApplications } from "@/repositories";
import { Api } from "@/store";

@Component
export default class UserAccess extends Vue {
  @Prop(Number) readonly userId!: number;

  accesses: Array<UserAccessApplications> = [];
  roleModalShow: Boolean = false;
  selectedAppBrand: {
    app_id: number;
    brand_id: number;
  } = { app_id: 0, brand_id: 0 };

  Api = Api;

  mounted() {
    if (!Api.Application.all.length) Api.Application.getAll();
    if (!Api.Brand.all.length) Api.Brand.getAll();
    if (!Api.Role.all.length) Api.Role.getAll();
    this.getAccesses();
  }

  @Watch("userId")
  async getAccesses() {
    if (this.userId)
      this.accesses = (await Api.User.getUserApplications(this.userId)) || [];
    this.$forceUpdate();
  }

  getRole(app_id: number, brand_id: number) {
    let role_id = 0;
    const finded_access = this.accesses.filter(
      (access) => access.app_id == app_id && access.brand_id == brand_id
    );
    if (finded_access && finded_access.length)
      role_id = finded_access[0].role_id || 0;
    if (role_id) {
      const finded_role = Api.Role.all.filter((role) => role.id == role_id);
      if (finded_role && finded_role.length) return finded_role[0];
    }
    return {};
  }

  roleBtnClick(app_id: number, brand_id: number) {
    this.selectedAppBrand = { app_id, brand_id };
    const current_role = this.getRole(app_id, brand_id);
    if (current_role.id)
      Api.User.setUserApplication({
        userId: this.userId,
        data: {
          app_id,
          brand_id,
          role_id: current_role.id,
          access: 0,
        },
      }).then(this.getAccesses);
    else this.roleModalShow = true;
  }

  addRole(data: {
    brand_id: number;
    app_id: number;
    role_id: number;
    access: number;
  }) {
    Api.User.setUserApplication({
      data,
      userId: this.userId,
    }).then(this.getAccesses);
  }
}
</script>

<style scoped>
.table-first-item {
  text-align: center;
  min-width: 200px;
  max-width: 200px;
}
.table-item {
  text-align: center;
  min-width: 150px;
  max-width: 150px;
}
.table {
  overflow-x: auto;
}
.table-row {
  flex-wrap: unset !important;
  margin: 0 !important;
}
.table-rows {
  min-width: 99% !important;
  max-width: unset !important;
  width: fit-content !important;
}
.role-btn {
  min-width: 100% !important;
  min-height: 100% !important;
  margin: 0 !important;
}
</style>

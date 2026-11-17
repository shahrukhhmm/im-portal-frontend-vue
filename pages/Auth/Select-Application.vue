<template>
  <div class="page-wrap">
    <div
      v-if="!(loading || Api.User.loading || Api.Auth.loading)"
      class="session-form-hold"
    >
      <base-card>
        <v-card-text>
          <h6 class="text-center text--disabled font-weight-medium mb-10">
            Select Application
          </h6>
          <v-list
            v-if="applications && Object.keys(applications).length"
            v-model="selectedApp"
          >
            <v-list-group
              no-action
              :key="application.name"
              v-for="application in applications"
              @click="selectedApp = application.name"
              :value="selectedApp == application.name"
            >
              <template v-slot:activator>
                <v-list-item-icon>
                  <v-icon> mdi-domain</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title v-text="application.name" />
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="brand in application.brands"
                :key="brand.brand.id"
                @click="
                  (event) =>
                    goToApplication(application.name, brand.brand.name, event)
                "
              >
                <v-list-item-content>
                  <v-list-item-title v-text="brand.brand.name" />
                  <v-list-item-subtitle v-text="brand.role.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
          <div class="text-center" v-else>
            <v-icon color="danger">mdi-alert-circle-outline </v-icon>
            <strong>
              No applications have been registered for your user account
            </strong>
          </div>
        </v-card-text>
      </base-card>
      <div class="text-center">
        <v-btn
          v-if="getProfile().level == 'Admin'"
          text
          class="mt-3"
          color="white"
          to="/brand/all"
        >
          Admin Panel
        </v-btn>
        <v-btn text class="mt-3" color="white" to="/auth/logout">
          logout
        </v-btn>
      </div>
    </div>
    <loading-overlay :show="loading || Api.User.loading || Api.Auth.loading" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import toClipboard from "@/utils/toClipboard";
import getProfile from "@/utils/getProfile";
import { Dictionary } from "@/models";
import { Api } from "@/store";

@Component
export default class SelectApplication extends Vue {
  Api = Api;
  getProfile = getProfile;
  applications: Dictionary<any> = {};
  loading: Boolean = false;
  selectedApp: string = "";

  mounted() {
    this.init();
  }

  async init() {
    getProfile().applications.forEach((application: any) => {
      this.applications[application.name.replace(/ /g, "").toLowerCase()] =
        application;
    });
    this.selectFirstApp();
    this.checkSingleAppBrand();
    this.checkReturnApp();
    this.$forceUpdate();
  }

  selectFirstApp() {
    if (this.applications) {
      const keys = Object.keys(this.applications);
      if (keys && keys.length)
        this.selectedApp = this.applications[keys[0]].name;
    }
  }

  checkSingleAppBrand() {
    if (this.applications) {
      const keys = Object.keys(this.applications);
      if (
        keys.length == 1 &&
        this.applications[keys[0]].brands &&
        this.applications[keys[0]].brands.length == 1
      )
        this.goToApplication(
          keys[0],
          this.applications[keys[0]].brands[0].brand.name
        );
    }
  }

  checkReturnApp() {
    const returnApplication = localStorage.getItem("application");
    const returnBrand = localStorage.getItem("brand");
    localStorage.removeItem("application");
    localStorage.removeItem("brand");
    if (returnApplication) {
      this.selectedApp = this.applications[returnApplication].name;
      const app =
        this.applications[returnApplication.replace(/ /g, "").toLowerCase()];
      if (app && app.brands && app.brands.length == 1)
        this.goToApplication(app.name, app.brands[0].brand.name);
      else if (returnBrand) {
        const finded = app.brands.filter(
          (brand: any) =>
            brand.brand.name.replace(/ /g, "").toLowerCase() == returnBrand
        );
        if (finded && finded.length)
          this.goToApplication(app.name, finded[0].brand.name);
      }
    }
  }

  async goToApplication(app_name: string, brand_name?: string, event?: any) {
    const app = await this.getApp(app_name.replace(/ /g, "").toLowerCase());
    if (event && event.ctrlKey)
      toClipboard(
        ("?" + "token=" + app.public_key + "&" + "brand=" + brand_name)
          .replace(/ /g, "")
          .toLowerCase()
      );
    else {
      this.loading = true;
      window.location.href = (
        app.app_url +
        "?" +
        "token=" +
        app.public_key +
        "&" +
        "brand=" +
        brand_name
      )
        .replace(/ /g, "")
        .toLowerCase();
    }
  }

  async getApp(app_key: string) {
    return await Api.Auth.getAppInfo(this.applications[app_key].app_id);
  }
}
</script>

<style lang="scss" scoped>
.page-wrap {
  background-color: #242939 !important;
  display: flex;
  align-items: center;
  padding: 40px 1rem;
  height: 100%;
  min-height: 100vh;
}

.session-form-hold {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}
</style>

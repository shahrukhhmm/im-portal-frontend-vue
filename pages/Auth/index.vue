<template>
  <loading-overlay :show="true" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Api } from "@/store";

@Component
export default class Auth extends Vue {
  mounted() {
    this.init();
  }

  async init() {
    if (localStorage.getItem("access_token")) {
      const response = await Api.Auth.getUserInfo();
      if (response?.level == "Admin" && !localStorage.getItem("application"))
        this.$router.push("/brand/all");
      else this.$router.push("/auth/select-application");
    } else this.$router.push("/auth/login");
  }
}
</script>

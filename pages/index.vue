<template>
  <loading-overlay show />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Index extends Vue {
  created() {
    if (this.$route.query.application)
      localStorage.setItem("application", "" + this.$route.query.application);
    if (this.$route.query.brand)
      localStorage.setItem("brand", "" + this.$route.query.brand);
    if (this.$route.query.logout !== undefined)
      this.$router.push("/auth/logout");
    else this.$router.push("/auth");
  }
}
</script>

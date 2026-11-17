<template>
  <div class="page-wrap">
    <div class="session-form-hold">
      <base-card>
        <v-card-text class="text-center">
          <img
            class="px-14 py-8"
            src="~/assets/im-logo.svg"
            alt="Influence Marketing"
          />
          <h6 class="text--disabled font-weight-medium mb-10">
            Password reset link will be sent to your email address
          </h6>
          <v-form ref="form" @submit.prevent="submit()">
            <v-text-field
              v-model="email"
              label="Email"
              :rules="[Validation.required, Validation.email]"
            />
            <v-btn class="mb-4" block color="primary" dark @click="submit">
              Submit
            </v-btn>
            <div class="d-flex justify-around">
              <v-btn text small color="primary" to="/auth/login">
                Sign In
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </base-card>
    </div>
    <loading-overlay :show="Api.Auth.loading" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import Validation from "@/utils/validation";
import { Api, AppStore } from "@/store";

@Component
export default class ForgetPassword extends Vue {
  Api = Api;
  Validation = Validation;

  email: string = "";

  submit() {
    if (this.formValidate())
      Api.Auth.forgotPassword(this.email).then((response) => {
        if (response) {
          AppStore.showSnackBar({
            message: "Password reset link has been sent to your email",
            color: "success",
          });
          this.$router.push("/auth");
        }
      });
  }

  formValidate() {
    return (this.$refs.form as any).validate();
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
  max-width: 400px;
  margin: 0 auto;
}
</style>

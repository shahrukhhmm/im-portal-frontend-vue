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
            Enter your new Password
          </h6>
          <v-form ref="form" @submit.prevent="submit()">
            <v-text-field
              v-model="email"
              name="input-10-2"
              label="Email"
              :rules="[Validation.email]"
            />
            <v-text-field
              v-model="password"
              :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordShow ? 'text' : 'password'"
              name="input-10-2"
              label="Password"
              :rules="[Validation.required, Validation.password]"
              @click:append="passwordShow = !passwordShow"
            />
            <v-text-field
              v-model="rePassword"
              :append-icon="rePasswordShow ? 'mdi-eye' : 'mdi-eye-off'"
              :type="rePasswordShow ? 'text' : 'password'"
              name="input-10-2"
              label="Confirm Password"
              :rules="[Validation.required, passwordConfirmation]"
              @click:append="rePasswordShow = !rePasswordShow"
            />

            <v-btn class="mb-4" block color="primary" dark @click="submit">
              Submit
            </v-btn>
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
export default class ResetPassword extends Vue {
  Api = Api;
  Validation = Validation;

  email: string = "";
  password: string = "";
  rePassword: string = "";

  passwordShow: boolean = false;
  rePasswordShow: boolean = false;

  mounted() {
    if (!this.$route.params.token) this.$router.push("/auth");
  }

  submit() {
    if (this.formValidate())
      Api.Auth.resetPassword({
        email: this.email,
        password: this.password,
        token: this.$route.params.token,
      }).then((response) => {
        if (response) {
          AppStore.showSnackBar({
            message: "Your password changed successfully",
            color: "success",
          });
          this.$router.push("/auth");
        }
      });
  }

  formValidate() {
    return (this.$refs.form as any).validate();
  }

  passwordConfirmation() {
    return Validation.password_confirmation(this.password, this.rePassword);
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

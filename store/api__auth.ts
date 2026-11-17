import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { Login, Configuration, AuthApiFactory } from "@/repositories";
import ResponseHandler from "@/utils/ResponseHandler";

@Module({
  name: "api__auth",
  stateFactory: true,
  namespaced: true,
})
export default class api__auth extends VuexModule {
  loading: Boolean = false;

  @Mutation
  setLoading(status: Boolean) {
    this.loading = status;
  }

  @Action
  async login(login: Login) {
    this.setLoading(true);
    const response = await AuthApiFactory()
      .authLogin(login)
      .catch((error) => ResponseHandler.ErrorHandler(error, true))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response)) {
      localStorage.setItem("profile", JSON.stringify(response.data || "{}"));
      localStorage.setItem("access_token", response.data.access_token || "");
      localStorage.setItem(
        "access_token_expires_at",
        response.data.expires_at || ""
      );
      return response.data;
    }
    return {};
  }

  @Action
  async logout() {
    this.setLoading(true);
    await AuthApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .userLogout()
      .catch((error) => ResponseHandler.ErrorHandler(error, true))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    return {};
  }

  @Action
  async getUserInfo() {
    this.setLoading(true);
    const response = await AuthApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .getUserInfo()
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response)) {
      localStorage.setItem("profile", JSON.stringify(response.data) || "{}");
      return response.data;
    }
    return {};
  }

  @Action
  async getAppInfo(appId: number) {
    this.setLoading(true);
    const response = await AuthApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .getAppInfo(appId)
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data;
    return {};
  }

  @Action
  async forgotPassword(email: string) {
    this.setLoading(true);
    const response = await AuthApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .forgotPassword({ email })
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);

    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data;

    return;
  }

  @Action
  async resetPassword(payload: {
    email: string;
    password: string;
    token: string;
  }) {
    this.setLoading(true);
    const response = await AuthApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .resetPassword(payload)
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);

    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data;
    return;
  }
}

import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import ResponseHandler from "@/utils/ResponseHandler";
import {
  Language,
  Configuration,
  LanguageApiFactory,
  BrandLanguage,
} from "@/repositories";

@Module({
  name: "api__language",
  stateFactory: true,
  namespaced: true,
})
export default class api__language extends VuexModule {
  loading: Boolean = false;
  all: Array<Language> = [];

  @Mutation
  setLoading(status: Boolean) {
    this.loading = status;
  }

  @Mutation
  updateAll(all: Array<Language>) {
    this.all = all;
  }

  @Action({ commit: "updateAll" })
  async getAll(): Promise<Array<Language>> {
    this.setLoading(true);
    const response = await LanguageApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .languageOptions()
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data as any;
    return [] as any;
  }

  @Action
  async getBrandLanguages(brandID: number): Promise<Array<BrandLanguage>> {
    this.setLoading(true);
    const response = await LanguageApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .brandLanguageIndex(brandID)
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data as any;
    return [] as any;
  }

  @Action
  async addBrandLanguage(payload: {
    brandID: number;
    language_id?: number;
    primary?: number;
  }) {
    this.setLoading(true);
    const response = await LanguageApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .brandLanguageCreate(payload.brandID, payload)
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data;
    return {};
  }

  @Action
  async removeBrandLanguage(brandLanguageID: number) {
    this.setLoading(true);
    const response = await LanguageApiFactory(
      new Configuration({
        accessToken: localStorage.getItem("access_token") || "",
      })
    )
      .brandLanguageDelete(brandLanguageID)
      .catch((error) => ResponseHandler.ErrorHandler(error))
      .finally(() => this.setLoading(false));
    this.setLoading(false);
    if (response && response.data && ResponseHandler.checkResponse(response))
      return response.data;
    return {};
  }
}

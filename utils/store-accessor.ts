import { getModule } from "vuex-module-decorators";
import themeConfig from "@/store/themeConfig";
import appStore from "@/store/appStore";
import { Store } from "vuex";

import api__auth from "@/store/api__auth";
import api__user from "@/store/api__user";
import api__role from "@/store/api__role";
import api__brand from "@/store/api__brand";
import api__language from "@/store/api__language";
import api__application from "@/store/api__application";
import api__organization from "@/store/api__organization";

let AppStore: appStore;
let ThemeConfig = themeConfig;

class Api {
  static Auth: api__auth;
  static User: api__user;
  static Role: api__role;
  static Brand: api__brand;
  static Language: api__language;
  static Application: api__application;
  static Organization: api__organization;
}

function initialiseStores(store: Store<any>): void {
  AppStore = getModule(appStore, store);
  Api.Auth = getModule(api__auth, store);
  Api.User = getModule(api__user, store);
  Api.Role = getModule(api__role, store);
  Api.Brand = getModule(api__brand, store);
  Api.Language = getModule(api__language, store);
  Api.Application = getModule(api__application, store);
  Api.Organization = getModule(api__organization, store);
}

export { initialiseStores, AppStore, Api, ThemeConfig };

<template>
  <v-container fluid>
    <breadcrumbs v-if="editMode" :locations="locations" />
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab href="#Details">Details</v-tab>
          <v-tab href="#Languages" v-if="editMode">Languages</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-tabs-items v-model="tab">
      <v-tab-item value="Details">
        <v-card-text>
          <form-standard
            ref="detailsForm"
            :model="newBrand"
            :fields="brandFormFields"
            @submit="detailsFormSubmit"
          />
        </v-card-text>
      </v-tab-item>
      <v-tab-item value="Languages">
        <v-card-text>
          <table-standard
            grid
            grid-only
            :items="brandLanguages"
            :config="languageConfig"
            :loading="Api.Language.loading"
            :key="languageTableForceUpdateIndex"
            @addNewLanguage="addBrandLanguageModalShow = true"
          />
          <add-brand-language-modal
            :title="
              brandLanguages.length
                ? 'Add Brand Language'
                : 'Set Default Language'
            "
            :show.sync="addBrandLanguageModalShow"
            @submit="addNewLanguage"
          />
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
    <loading-overlay :show="Api.Brand.loading" />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Brand, BrandLanguage, BrandResource } from "@/repositories";
import { fromResource } from "@/utils/fromResource";
import Validation from "@/utils/validation";
import { FormField } from "@/models";
import { Api, AppStore } from "@/store";

@Component({ layout: "panel" })
export default class BrandForm extends Vue {
  @Prop(Boolean) readonly editMode!: Boolean;

  Api = Api;

  tab = "";

  locations: Array<{ title: string; to: string }> = [];

  newBrand: Brand = {};
  brandFormFields: Array<FormField> = [];
  brandLanguages: Array<BrandLanguage> = [];
  customFieldsFormForceUpdateIndex = 0;
  languageTableForceUpdateIndex = 0;
  addBrandLanguageModalShow: boolean = false;
  languageConfig = {};

  initLanguageConfig() {
    this.languageConfig = {
      headers: [
        { text: "Title", value: "language.title" },
        { text: "", value: "actions", sortable: false, width: "0" },
      ],
      actions: [
        {
          type: "delete",
          icon: "mdi-delete",
          if: (Language: BrandLanguage) => !Language.primary,
          onClick: (Language: BrandLanguage) => {
            AppStore.showDeleteConfirmationModal({
              deleteItemTitle: Language.language?.title || "Language",
              deleteItem: Language,
              agreeButton: { callback: this.deleteLanguage },
            });
          },
        },
      ],
      globalActions: [
        {
          text: this.brandLanguages.length
            ? "Add Language"
            : "Set Default Language",
          icon: this.brandLanguages.length ? "mdi-plus" : undefined,
          color: "primary",
          action: "addNewLanguage",
        },
      ],
      grid: {
        title: "language.title",
        chips: (Language: BrandLanguage) =>
          Language.primary ? ["Default language"] : undefined,
      },
    };
    this.languageTableForceUpdateIndex++;
  }

  async initDetailsTab() {
    await this.getBrand();
    this.updateBrandFormFields();
    this.updateLocations();
  }

  async initLanguagesTab() {
    this.initLanguageConfig();
    if (!Api.Language.all.length) Api.Language.getAll();
    await this.getBrandLanguages();
    this.initLanguageConfig();
  }

  async deleteLanguage(Language: BrandLanguage) {
    if (Language.id) await Api.Language.removeBrandLanguage(Language.id);
    this.initLanguagesTab();
  }

  updateLocations() {
    this.locations = [
      {
        title: "Brands",
        to: "/brand/all",
      },
      {
        title: this.newBrand.name!,
        to: "/brand/edit/" + this.newBrand.id,
      },
    ];
  }

  async initCustomFieldsTab() {
    this.customFieldsFormForceUpdateIndex++;
  }

  async getBrand() {
    if (this.editMode)
      this.newBrand = fromResource<Brand>(
        await Api.Brand.get(+this.$route.params.id)
      );
  }

  async getBrandLanguages() {
    this.brandLanguages = await Api.Language.getBrandLanguages(
      +this.$route.params.id
    );
  }

  async addNewLanguage(language_id: number) {
    await Api.Language.addBrandLanguage({
      language_id,
      brandID: +this.$route.params.id,
      primary: this.brandLanguages.length ? 0 : 1,
    });
    this.initLanguagesTab();
  }

  updateBrandFormFields() {
    this.brandFormFields = [
      {
        label: "Name",
        modelKey: "name",
        type: "form-field-text",
        rules: [Validation.required],
        colAttrs: { cols: 12 },
      },
      {
        type: "form-field-file",
        label: "Logo",
        modelKey: "file",
        if: this.media_upload_show,
        colAttrs: { cols: 12 },
      },
      {
        type: "form-field-preview",
        label: "Logo",
        modelKey: "logo",
        if: this.media_preview_show,
        onClick: this.removeLogo,
        colAttrs: { cols: 12 },
      },
    ];
  }

  get_record_id() {
    return this.newBrand.id!;
  }

  media_preview_show() {
    return this.editMode && !!(this.newBrand as BrandResource).thumbnail;
  }

  media_upload_show() {
    return (
      !this.editMode ||
      (this.editMode && !(this.newBrand as BrandResource).thumbnail)
    );
  }

  removeLogo() {
    (this.newBrand as BrandResource).thumbnail = undefined;
  }

  async detailsFormSubmit() {
    if (this.formValidate()) {
      if (this.editMode && this.newBrand.id)
        await Api.Brand.update({
          id: this.newBrand.id,
          brand: this.newBrand,
        });
      else await Api.Brand.create(this.newBrand);
      if (!this.editMode) this.$router.push("/brand/all");
    }
  }

  formValidate() {
    return (this.$refs.detailsForm as any).validate();
  }

  @Watch("tab")
  tabChanged(newTab: string, _: string) {
    switch (newTab) {
      case "Details":
        this.initDetailsTab();
        break;
      case "Languages":
        this.initLanguagesTab();
        break;
      default:
        break;
    }
  }
}
</script>

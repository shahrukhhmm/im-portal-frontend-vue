<template>
  <v-container fluid>
    <breadcrumbs v-if="editMode" :locations="locations" />
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab v-if="editMode" href="#Settings">Settings</v-tab>
          <v-tab href="#Details">Details</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-tabs-items v-model="tab">
      <v-tab-item value="Settings">
        <v-card-text>
          <form-standard
            ref="settingsForm"
            :model="applicationSetting"
            :fields="settingsFormFields"
            @submit="settingsFormSubmit"
          />
        </v-card-text>
      </v-tab-item>
      <v-tab-item value="Details">
        <v-card-text>
          <form-standard
            ref="detailsForm"
            :model="newApplication"
            :fields="applicationFormFields"
            @submit="detailsFormSubmit"
          />
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
    <loading-overlay :show="Api.Application.loading" />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { fromResource } from "@/utils/fromResource";
import { Application, ApplicationSetting } from "@/repositories";
import Validation from "@/utils/validation";
import { FormField } from "@/models";
import { Api } from "@/store";

@Component({ layout: "panel" })
export default class ApplicationForm extends Vue {
  @Prop(Boolean) readonly editMode!: Boolean;

  Api = Api;

  tab = "";

  locations: Array<{ title: string; to: string }> = [];

  newApplication: Application = {};
  applicationSetting: ApplicationSetting = { app_url: "", api_url: "", ip: "" };

  applicationFormFields: Array<FormField> = [];
  settingsFormFields: Array<FormField> = [];

  mounted() {
    this.updateLocations();
  }

  async initDetailsTab() {
    await this.getApplication();
    this.updateApplicationFormFields();
  }

  async initSettingsTab() {
    await this.getApplicationSettings();
    this.updateSettingsFormFields();
  }

  async updateLocations() {
    if (!this.newApplication || !this.newApplication.id)
      await this.getApplication();
    this.locations = [
      {
        title: "Applications",
        to: "/application/all",
      },
      {
        title: this.newApplication.name!,
        to: "/application/edit/" + this.newApplication.id,
      },
    ];
  }

  async getApplication() {
    if (this.editMode)
      this.newApplication = fromResource<Application>(
        await Api.Application.get(+this.$route.params.id)
      );
  }

  async getApplicationSettings() {
    if (this.editMode)
      this.applicationSetting = fromResource<ApplicationSetting>(
        (await Api.Application.getSetting(+this.$route.params.id))?.settings
      );
  }

  updateApplicationFormFields() {
    this.applicationFormFields = [
      {
        label: "Name",
        modelKey: "name",
        type: "form-field-text",
        rules: [Validation.required],
        colAttrs: { cols: 12 },
      },
    ];
  }

  updateSettingsFormFields() {
    this.settingsFormFields = [
      {
        label: "App Url",
        modelKey: "app_url",
        type: "form-field-text",
        rules: [Validation.required],
        colAttrs: { cols: 12 },
      },
      {
        label: "Api Url",
        modelKey: "api_url",
        type: "form-field-text",
        colAttrs: { cols: 12 },
      },
      {
        label: "IP",
        modelKey: "ip",
        type: "form-field-text",
        colAttrs: { cols: 12 },
      },
    ];
  }

  get_record_id() {
    return this.newApplication.id!;
  }

  async detailsFormSubmit() {
    if (this.detailsFormValidate()) {
      if (this.editMode && this.newApplication.id)
        await Api.Application.update({
          id: this.newApplication.id,
          application: this.newApplication,
        });
      else await Api.Application.create(this.newApplication);
      if (!this.editMode) this.$router.push("/application/all");
    }
  }

  async settingsFormSubmit() {
    if (this.settingsFormValidate())
      if (this.newApplication.id)
        await Api.Application.setSetting({
          id: this.newApplication.id,
          applicationSetting: this.applicationSetting,
        });
  }

  detailsFormValidate() {
    return (this.$refs.detailsForm as any).validate();
  }

  settingsFormValidate() {
    return (this.$refs.settingsForm as any).validate();
  }

  @Watch("tab")
  tabChanged(newTab: string, _: string) {
    switch (newTab) {
      case "Details":
        this.initDetailsTab();
        break;
      case "Settings":
        this.initSettingsTab();
        break;
      default:
        break;
    }
  }
}
</script>

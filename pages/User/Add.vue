<template>
  <v-container fluid>
    <breadcrumbs v-if="editMode" :locations="locations" />
    <v-row>
      <v-col>
        <v-tabs show-arrows v-model="tab" background-color="transparent">
          <v-tab v-if="!profile && editMode" href="#Access">Access</v-tab>
          <v-tab href="#Details">Details</v-tab>
        </v-tabs>
      </v-col>
    </v-row>
    <v-tabs-items
      v-model="tab"
      :class="{ 'background-color-transparent': tab == 'Access' }"
    >
      <v-tab-item value="Access">
        <user-access :user-id="User.user_id" />
      </v-tab-item>
      <v-tab-item value="Details">
        <v-card-text>
          <form-standard
            ref="detailsForm"
            :model="User"
            :fields="userFormFields"
            @submit="detailsFormSubmit"
          />
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
    <loading-overlay :show="Api.User.loading" />
  </v-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { fromResource } from "@/utils/fromResource";
import selectItems from "@/utils/select-items";
import Validation from "@/utils/validation";
import getProfile from "@/utils/getProfile";
import { User } from "@/repositories";
import { FormField } from "@/models";
import { Api } from "@/store";

@Component({ layout: "panel" })
export default class UserForm extends Vue {
  @Prop(Boolean) readonly editMode!: Boolean;
  @Prop(Boolean) readonly profile!: Boolean;

  Api = Api;

  tab = "";

  locations: Array<{ title: string; to: string }> = [];

  User: User = {};

  userFormFields: Array<FormField> = [];

  mounted() {
    this.updateLocations();
  }

  async initDetailsTab() {
    await this.getUser();
    this.updateUserFormFields();
  }

  async initAccessTab() {
    console.log("initAccessTab");
  }

  async updateLocations() {
    if (!this.User || !this.User.id) await this.getUser();
    this.locations = [
      {
        title: "Users",
        to: "/user/all",
      },
      {
        title: this.User.first_name + " " + this.User.last_name,
        to: "/user/edit/" + (this.User as any).user_id,
      },
    ];
  }

  async getUser() {
    if (this.editMode)
      this.User = fromResource<User>(
        await Api.User.get(
          this.profile ? +getProfile().user_id! : +this.$route.params.id
        )
      );
  }

  updateUserFormFields() {
    this.userFormFields = [
      {
        label: "First Name",
        modelKey: "first_name",
        type: "form-field-text",
        rules: [Validation.required],
        colAttrs: { cols: 12, md: 6 },
      },
      {
        label: "Last Name",
        modelKey: "last_name",
        type: "form-field-text",
        rules: [Validation.required],
        colAttrs: { cols: 12, md: 6 },
      },
      {
        label: "Email",
        modelKey: "email",
        disabled: this.profile,
        type: "form-field-text",
        rules: [Validation.required, Validation.email],
        colAttrs: { cols: 12, md: 6 },
      },
      {
        label: "Level",
        modelKey: "level",
        "item-text": "title",
        "item-value": "value",
        disabled: this.profile,
        type: "form-field-select",
        rules: [Validation.required],
        items: selectItems.user_level,
        colAttrs: { cols: 12, md: 6 },
      },
      {
        label: "Password",
        modelKey: "password",
        type: "form-field-password",
        placeholder: this.editMode
          ? "Leave blank if you don't want to change it"
          : undefined,
        rules: [
          !this.editMode ? Validation.required : true,
          Validation.password,
        ],
        colAttrs: { cols: 12 },
      },
      {
        label: "Password Confirmation",
        modelKey: "password_confirm",
        type: "form-field-password",
        placeholder: this.editMode
          ? "Leave blank if you don't want to change it"
          : undefined,
        rules: [
          !this.editMode
            ? Validation.required
            : this.passwordConfirmationValidation,
          this.passwordConfirmationValidation,
        ],
        colAttrs: { cols: 12 },
      },
    ];
  }

  passwordConfirmationValidation() {
    return (
      (!this.User.password && !(this.User as any).password_confirm) ||
      this.User.password === (this.User as any).password_confirm ||
      "Password must match"
    );
  }

  async detailsFormSubmit() {
    if (this.formValidate()) {
      if (this.editMode) {
        if (!this.User.password) this.User.password = undefined;
        if (!(this.User as any).password_confirm)
          (this.User as any).password_confirm = undefined;
        await Api.User.update({
          id: this.profile ? +getProfile().user_id! : +this.$route.params.id,
          user: this.User,
        });
      } else await Api.User.register(this.User);
      if (!this.editMode) this.$router.push("/user/all");
      else this.getUser();
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
      case "Access":
        this.initAccessTab();
        break;
      default:
        break;
    }
  }
}
</script>

<template>
  <v-dialog v-model="showSynced" max-width="400px">
    <v-card>
      <v-card-title>
        {{ title }}
        <v-spacer />
        <v-btn icon @click="showSynced = false">
          <v-icon>mdi-window-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <form-standard
          ref="form"
          :model="data"
          :fields="formFields"
          @submit="submit"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Prop } from "vue-property-decorator";
import Validation from "@/utils/validation";
import { FormField } from "@/models";
import { Api } from "@/store";

@Component
export default class addBrandLanguageModal extends Vue {
  @PropSync("show", { type: Boolean }) showSynced!: Boolean;
  @Prop({ default: "Add Brand Language" }) readonly title!: string;

  data: any = {
    languageId: null,
  };

  formFields: Array<FormField> = [
    {
      type: "form-field-select-autocomplete",
      label: "Language",
      "item-value": "id",
      "item-text": "title",
      colAttrs: { cols: 12 },
      modelKey: "languageId",
      rules: [Validation.required],
      items: () => Api.Language.all,
      loading: () => Api.Language.loading,
    },
  ];

  mounted() {
    if (!Api.Language.all.length) Api.Language.getAll();
  }

  reset() {
    this.data = { languageId: null };
  }

  submit() {
    if (this.formValidate()) {
      this.showSynced = false;
      this.$emit("submit", this.data.languageId);
      this.reset();
    }
  }

  formValidate() {
    return (this.$refs.form as any).validate();
  }
}
</script>

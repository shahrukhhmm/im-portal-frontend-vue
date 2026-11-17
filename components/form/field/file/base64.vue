<template>
  <form-field-file-multiple :field="field" v-model="file" :multiple="false" />
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel, Watch } from "vue-property-decorator";
import toBase64 from "@/utils/toBase64";
import { FormField } from "@/models";

@Component
export default class FileFormField extends Vue {
  @VModel() model!: Array<any> | any;
  @Prop(Object) readonly field!: FormField;

  file: any = "";

  @Watch("file")
  async fileChanged(file: any) {
    if (file) this.model = await toBase64(file);
  }
}
</script>

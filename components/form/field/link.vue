<template>
  <v-col class="py-2" v-bind="field.colAttrs">
    <label v-text="field.label" />
    <br />
    <a :href="model" v-text="model" target="_blank" />
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, Prop, VModel } from "vue-property-decorator";
import { FormField } from "@/models";

@Component
export default class LabelFormField extends Vue {
  @Prop(Object) readonly field!: FormField;
  @VModel() model!: string;
}
</script>

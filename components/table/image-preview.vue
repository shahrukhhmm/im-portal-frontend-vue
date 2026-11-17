<template>
  <v-menu v-model="showMenu" absolute offset-y style="max-width: 600px">
    <template v-slot:activator="{ on, attrs }">
      <v-img
        :src="url"
        v-on="on"
        v-bind="attrs"
        max-width="64"
        max-height="64"
      />
    </template>

    <v-list dense>
      <v-list-item link :href="url" target="_blank">
        <v-list-item-icon>
          <v-icon> mdi-open-in-new</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> Open in new tab </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="toClipboard(url)">
        <v-list-item-icon>
          <v-icon> mdi-clipboard-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> Copy url to Clipboard </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import toClipboard from "@/utils/toClipboard";

@Component
export default class TableImagePreview extends Vue {
  @Prop(String) readonly url!: string;

  toClipboard = toClipboard;

  showMenu: boolean = false;
}
</script>

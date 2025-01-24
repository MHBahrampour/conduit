import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import {
  VueQueryPlugin,
  type VueQueryPluginOptions,
} from "@tanstack/vue-query";

const vueQueryPluginOptions: VueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: { queries: { staleTime: 1 * 60 * 1000 } },
  },
};

const app = createApp(App);
app.use(router);
app.use(VueQueryPlugin, vueQueryPluginOptions);
app.mount("#app");

import "vuetify/styles";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import vueFlagIcon from "vue-flag-icon";

loadFonts();

createApp(App).use(router).use(vueFlagIcon).use(vuetify).mount("#app");


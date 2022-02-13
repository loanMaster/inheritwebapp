import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Userfront from "@userfront/core";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";
import { visibilityDirective } from "@/directives/VisibilityDirective";
Userfront.init(userFrontTenant);

const app = createApp(App);
app.use(router).mount("#app");
app.directive("my-visible", visibilityDirective);

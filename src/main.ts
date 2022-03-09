import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/main.css";
import { visibilityDirective } from "@/directives/VisibilityDirective";
import { autofocusDirective } from "@/directives/AutofocusDirective";
import { appStore } from "@/store/store";
import { registerAuthInterceptor } from "@/interceptors/auth.interceptor";
import { isTokenValid } from "@/util/token.utils";
import { timer } from "rxjs";
import Userfront from "@userfront/core";

const app = createApp(App);
app.use(appStore).use(router);
appStore.dispatch("initUserFront");
registerAuthInterceptor(appStore);
app.directive("my-visible", visibilityDirective);
app.directive("my-focus", autofocusDirective);
app.mount("#app");

timer(10000, 30000).subscribe(() => {
  if (
    Userfront.tokens?.accessToken &&
    !isTokenValid(Userfront.tokens.accessToken)
  ) {
    const redirect = router.currentRoute.value.matched.some(
      ({ name }: { name: any }) => {
        return name === "Dashboard";
      }
    )
      ? undefined
      : false;
    appStore.dispatch("logout", { redirect });
  }
});

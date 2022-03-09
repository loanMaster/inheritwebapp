import { Store } from "vuex";
import { AppState } from "@/store/store";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store<AppState>;
  }
}

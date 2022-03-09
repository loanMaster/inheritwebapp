import Userfront from "@userfront/core";
import { isTokenValid, shouldRefreshToken } from "@/util/token.utils";
import { Store } from "vuex";
import { AppState } from "@/store/store";

export const registerAuthInterceptor = (store: Store<AppState>) => {
  const { fetch: originalFetch } = window;
  window.fetch = async (resource: RequestInfo, init?: RequestInit) => {
    const url =
      typeof resource === "string" ? (resource as string) : resource.url;
    if (url.indexOf("http://") === -1 || url.indexOf("https://") === -1) {
      if (shouldRefreshToken(Userfront.tokens?.accessToken)) {
        await store.dispatch("refreshAccessToken");
      }
      init = init || {};
      const headers: any = init.headers || {};
      headers.Authorization = "Bearer " + Userfront.tokens?.accessToken;
    }

    const response = await originalFetch(resource, init);
    if (!response.ok && response.status === 401) {
      if (!isTokenValid(Userfront.tokens.accessToken)) {
        await store.dispatch("logout");
      }
    }
    return response;
  };
};

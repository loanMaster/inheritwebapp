import { Commit, createStore, Store } from "vuex";
import { Settings } from "@/entities/settings";
import { SettingsService } from "@/service/settings.service";
import { Observable, ReplaySubject } from "rxjs";
import Userfront from "@userfront/core";
import { Archive } from "@/entities/archive";
import { HealthCheckResponse } from "@/entities/health-check.response";
import { filter, take } from "rxjs/operators";
import { CreateArchiveDto } from "@/entities/create.archive.dto";
import { UpdateArchiveDto } from "@/entities/update.archive.dto";
import { HistoryService } from "@/service/history.service";
import { EventHistory } from "@/entities/history";
import { isTokenValid } from "@/util/token.utils";

export interface AppState {
  settings: Settings | undefined;
  history: EventHistory | undefined;
  currentArchive: Archive | undefined;
  accessToken: string | undefined;
  email: string | undefined;
  user: { email: string; createdAt: string };
  healthCheck: HealthCheckResponse | undefined;
}

export const waitForSettings = (store: Store<AppState>): Promise<AppState> => {
  return toObservable(store)
    .pipe(
      filter((state) => !!state.settings),
      take(1)
    )
    .toPromise() as Promise<AppState>;
};

export const toObservable = (store: Store<AppState>): Observable<AppState> => {
  const obs = new ReplaySubject<AppState>(1);
  store.subscribe((_: any, value: AppState) => obs.next(value));
  obs.next(store.state);
  return obs;
};

export const appStore = createStore({
  state() {
    return {
      settings: undefined,
      history: undefined,
      currentArchive: undefined,
      healthCheck: undefined,
      user: { email: "", createdAt: "" },
      accessToken: undefined,
      email: undefined,
    } as AppState;
  },
  mutations: {
    settings(state: AppState, settings: Partial<Settings>) {
      state.settings = {
        ...(state.settings || {}),
        ...settings,
      } as Settings;
    },
    currentArchive(state: AppState, archive: Archive) {
      state.currentArchive = archive;
    },
    healthCheck(state: AppState, healthCheckResponse: HealthCheckResponse) {
      state.healthCheck = healthCheckResponse;
    },
    history(state: AppState, history: EventHistory) {
      state.history = history;
    },
    invalidateHistory(state: AppState) {
      state.history = undefined;
    },
    user(state: AppState) {
      state.user = {
        email: Userfront.user.email || "",
        createdAt: Userfront.user.createdAt || "",
      };
      state.email = state.user.email;
      state.accessToken = Userfront.tokens?.accessToken;
    },
    firstAccess(state: AppState, firstAccess: boolean) {
      (state.settings as Settings).justCreated = firstAccess;
    },
  },
  actions: {
    async fetchSettings({
      commit,
      state,
    }: {
      commit: Commit;
      state: AppState;
    }) {
      if (state.settings) {
        return state.settings;
      }
      commit("settings", await new SettingsService().fetchSettings());
    },
    async fetchHistory({ commit, state }: { commit: Commit; state: AppState }) {
      if (state.history) {
        return state.history;
      }
      commit("history", await new HistoryService().fetchHistory());
    },
    async updateSettings(
      { commit }: { commit: Commit },
      settingsUpdate: Partial<Settings>
    ) {
      commit(
        "settings",
        await new SettingsService().updateServiceSettings(settingsUpdate)
      );
      commit("invalidateHistory");
    },
    async triggerHealthCheck(
      { commit, state }: { commit: Commit; state: AppState },
      code: string
    ) {
      const healthCheckResponse =
        await new SettingsService().triggerHealthCheck(code);
      commit("currentArchive", healthCheckResponse.archive);
      if (
        state.settings &&
        state.settings.email === healthCheckResponse.email
      ) {
        commit("settings", {
          dueDate: healthCheckResponse.dueDate as number,
          triggerOnce: healthCheckResponse.triggerOnce as boolean,
        });
      }
      commit("healthCheck", healthCheckResponse);
      commit("invalidateHistory");
    },
    async createArchive(
      { commit }: { commit: Commit },
      createArchiveDto: CreateArchiveDto
    ) {
      const { settings, archiveId } = await new SettingsService().createArchive(
        createArchiveDto
      );
      commit("settings", settings);
      commit(
        "currentArchive",
        settings.archives.find((a) => a.id === archiveId)
      );
      commit("invalidateHistory");
    },
    async updateArchive(
      { commit }: { commit: Commit },
      updateArchiveDto: UpdateArchiveDto
    ) {
      const { settings, archiveId } = await new SettingsService().updateArchive(
        updateArchiveDto
      );
      commit("settings", settings);
      commit(
        "currentArchive",
        settings.archives.find((a) => a.id === archiveId)
      );
      commit("invalidateHistory");
    },
    async deleteArchive({ commit }: { commit: Commit }, archiveId: string) {
      const settings = await new SettingsService().deleteArchive(archiveId);
      commit("settings", settings);
      commit("currentArchive", undefined);
      commit("invalidateHistory");
    },
    async logout(
      { commit }: { commit: Commit },
      options?: { redirect?: boolean }
    ) {
      await Userfront.logout({ redirect: options?.redirect });
      commit("user");
    },
    async login(
      { commit }: { commit: Commit },
      options: {
        method?: string;
        uuid?: string;
        token: string;
        emailOrUsername?: string;
        password?: string;
      }
    ) {
      await Userfront.login(options as any);
      commit("user");
    },
    redirectIfLoggedIn() {
      Userfront.redirectIfLoggedIn({});
    },
    async resetPassword(_: any, options: any) {
      await Userfront.resetPassword(options);
    },
    async sendResetLink(_: any, email: string) {
      await Userfront.sendResetLink(email);
    },
    async sentVerificationLink() {
      const payload = {
        email: Userfront.user.email,
        userId: Userfront.user.userId,
        tenantId: userFrontTenant,
      };
      await fetch("https://api.userfront.com/v0/auth/verify/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    },
    async signup(
      { commit }: { commit: Commit },
      options: {
        method: string;
        email?: string;
        password?: string;
        redirect?: boolean;
      }
    ) {
      await Userfront.signup(options);
      commit("user");
    },
    async refreshAccessToken({ commit }: { commit: Commit }) {
      try {
        await (Userfront.tokens as any).refresh();
      } catch (error) {
        // pass
      }
      if (!isTokenValid(Userfront.tokens.accessToken)) {
        await Userfront.logout({});
      } else {
        commit("user");
      }
    },
    async initUserFront({ commit }: { commit: Commit }) {
      await Userfront.init(userFrontTenant);
      commit("user");
    },
  },
  strict: true,
});

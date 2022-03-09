import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import Home from "../components/home/HomeBeauty.vue";
import Userfront from "@userfront/core";
import { isTokenValid, shouldRefreshToken } from "@/util/token.utils";
import { appStore } from "@/store/store";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import HistoryComponent from "@/components/dashboard/history/History.vue";
import ServiceInfo from "@/components/dashboard/info/ServiceInfo.vue";
import ServiceSettings from "@/components/dashboard/ServiceSettings.vue";
import ManageArchives from "@/components/dashboard/manage-archives/ManageArchives.vue";
import CreatedEncryptedArchive from "@/components/dashboard/create-archive/CreatedEncryptedArchive.vue";
import Donations from "@/components/documentation/Donations.vue";
import Account from "@/components/dashboard/account/Account.vue";
import Documentation from "@/components/documentation/Documentation.vue";
import Introduction from "@/components/documentation/Introduction.vue";
import Faq from "@/components/documentation/Faq.vue";
import Contact from "@/components/documentation/Contact.vue";
import Signup from "@/components/user-management/Signup.vue";
import VerificationPending from "@/components/user-management/VerificationPending.vue";
import Login from "@/components/user-management/Login.vue";
import ResetPassword from "@/components/user-management/ResetPassword.vue";
import Reset from "@/components/user-management/Reset.vue";
import AccessArchive from "@/components/access-archive/AccessArchive.vue";

const routes = [
  {
    path: "/",
    name: "HomeBeauty",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    redirect: { path: "/dashboard/create-encrypted-archive" },
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (
        !Userfront.tokens.accessToken ||
        !isTokenValid(Userfront.tokens.accessToken)
      ) {
        next({ name: "login" });
      } else if (!Userfront.user.isConfirmed) {
        next({ name: "VerificationPending" });
      } else {
        next();
      }
    },
    children: [
      {
        path: "service-settings",
        name: "ServiceSettings",
        component: ServiceSettings,
      },
      {
        path: "info",
        name: "HealthCheckInfo",
        component: ServiceInfo,
      },
      {
        path: "history",
        name: "History",
        component: HistoryComponent,
      },
      {
        path: "manage-archives",
        name: "ManageArchives",
        component: ManageArchives,
      },
      {
        path: "create-encrypted-archive",
        name: "CreatedEncryptedArchive",
        component: CreatedEncryptedArchive,
      },
      {
        path: "donations",
        name: "DashboardDonations",
        component: Donations,
      },
      {
        path: "account",
        name: "Account",
        component: Account,
      },
    ],
  },
  {
    path: "/docs",
    name: "Documentation",
    redirect: { path: "/docs/introduction" },
    component: Documentation,
    children: [
      {
        path: "introduction",
        name: "Introduction",
        component: Introduction,
      },
      {
        path: "faq",
        name: "FAQ",
        component: Faq,
      },
      {
        path: "contact",
        name: "Contact",
        component: Contact,
      },
      {
        path: "donations",
        name: "Donations",
        component: Donations,
      },
    ],
  },
  {
    path: "/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/verification-pending",
    name: "VerificationPending",
    component: VerificationPending,
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      if (
        !Userfront.tokens.accessToken ||
        !isTokenValid(Userfront.tokens.accessToken)
      ) {
        next({ name: "login" });
      } else if (Userfront.user.isConfirmed) {
        next({ name: "Dashboard" });
      } else {
        next();
      }
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
  },
  {
    path: "/reset",
    name: "reset",
    component: Reset,
  },
  {
    path: "/health-check-and-decrypt",
    name: "health-check-and-decrypt",
    component: AccessArchive,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach(async () => {
  if (Userfront.tokens && shouldRefreshToken(Userfront.tokens?.accessToken)) {
    await appStore.dispatch("refreshAccessToken");
  }
  return true;
});

export default router;

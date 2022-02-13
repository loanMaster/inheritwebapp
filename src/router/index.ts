import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from "vue-router";
import Home from "../views/HomeBeauty.vue";
import Userfront from "@userfront/core";
import * as jwtDecode from "jwt-decode";

const routes = [
  {
    path: "/",
    name: "HomeBeauty",
    component: Home,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
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
      } else {
        next();
      }
    },
    children: [
      {
        path: "service-settings",
        name: "ServiceSettings",
        component: () => import("../views/ServiceSettings.vue"),
      },
      {
        path: "info",
        name: "HealthCheckInfo",
        component: () => import("../views/ServiceInfo.vue"),
      },
      {
        path: "manage-archives",
        name: "ManageArchives",
        component: () => import("../views/ManageArchives.vue"),
      },
      {
        path: "create-encrypted-archive",
        name: "CreatedEncryptedArchive",
        component: () => import("../views/CreatedEncryptedArchive.vue"),
      },
    ],
  },
  {
    path: "/docs",
    name: "Documentation",
    component: () => import("../views/Documentation.vue"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("../views/Signup.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/reset",
    name: "reset",
    component: () => import("../views/Reset.vue"),
  },
  {
    path: "/decrypt",
    name: "decrypt",
    component: () => import("../views/Decrypt.vue"),
  },
  {
    path: "/trigger-health-check",
    name: "trigger-health-check",
    component: () => import("../views/TriggerHealthCheck.vue"),
  },
];

export function isTokenValid(token: string) {
  try {
    const decoded: { exp: number } = jwtDecode.default(token);
    const now = Date.now() / 1000;
    return now < decoded.exp;
  } catch (error) {
    return false;
  }
}

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;

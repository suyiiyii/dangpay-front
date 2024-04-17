// src/router/index.ts
import { pa } from "element-plus/es/locale";
import path from "path";
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./page/LoginView.vue"),
  },
  {
    path: "/group",
    name: "Group",
    component: () => import("./page/GroupView.vue"),
  },
  {
    path: "/group/:id",
    name: "GroupDetail",
    component: () => import("./page/GroupDetailView.vue"),
  },

  // 其他路由...
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

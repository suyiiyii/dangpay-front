// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
// import HomePage from "./page/HomePage.vue";
// import HelloWorld from "./components/HelloWorld.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("./page/LoginView.vue"),
  },

  // 其他路由...
];

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;

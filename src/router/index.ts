import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Settings from "@/views/Settings.vue";
import Editor from "@/views/Editor.vue";
import EditArticle from "@/views/EditArticle.vue";
import Article from "@/views/Article.vue";
import Profile from "@/views/Profile.vue";
import ProfileFavorites from "@/views/ProfileFavorites.vue";

const routes: RouteRecordRaw[] = [
  // Home Page
  {
    path: "/",
    name: "Home",
    component: Home,
  },

  // Sign In/Sign Up Pages
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },

  // Settings Page
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
  },

  // Editor Page
  {
    path: "/editor/:slug?",
    name: "Editor",
    component: Editor,
    props: true,
  },

  // Article Page
  {
    path: "/article/:slug",
    name: "Article",
    component: Article,
    props: true,
  },

  // Profile Page
  {
    path: "/profile/:username",
    name: "Profile",
    component: Profile,
    props: true,
  },
  {
    path: "/profile/:username/favorites",
    name: "ProfileFavorites",
    component: ProfileFavorites,
    props: true,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const publicRoutes = ["Login", "Register", "Home"];

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem("conduit-token");

  if (
    !isAuthenticated &&
    to.name !== "Login" &&
    !publicRoutes.includes(to.name as string)
  ) {
    next({ name: "Login" });
  } else {
    next();
  }
});

export default router;

<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { fetchCurrentUser } from "@/services/authServices";
import { useQuery } from "@tanstack/vue-query";
import { useRoute } from "vue-router";

const route = useRoute();
const { isLoggedIn } = useAuth();

const { data: currentUser } = useQuery({
  queryFn: () => fetchCurrentUser(),
  queryKey: ["currentUser"],
});
</script>

<template>
  <header>
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="/">conduit</a>
        <ul v-if="isLoggedIn" class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class dynamically -->
            <router-link
              to="/"
              class="nav-link"
              :class="{ active: route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/editor"
              class="nav-link"
              :class="{ active: route.path.startsWith('/editor') }"
            >
              <i class="ion-compose"></i>&nbsp;New Article
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/settings"
              class="nav-link"
              :class="{ active: route.path === '/settings' }"
            >
              <i class="ion-gear-a"></i>&nbsp;Settings
            </router-link>
          </li>
          <li class="nav-item" v-if="currentUser">
            <router-link
              :to="`/profile/${currentUser.username}`"
              class="nav-link"
              :class="{ active: route.path.startsWith('/profile') }"
            >
              <img
                :src="currentUser.image || ''"
                class="user-pic"
                alt="user pic"
              />
              {{ currentUser.username }}
            </router-link>
          </li>
        </ul>
        <ul v-else class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <router-link
              to="/"
              class="nav-link"
              :class="{ active: route.path === '/' }"
            >
              Home
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/login"
              class="nav-link"
              :class="{ active: route.path === '/login' }"
            >
              Sign in
            </router-link>
          </li>
          <li class="nav-item">
            <router-link
              to="/register"
              class="nav-link"
              :class="{ active: route.path === '/register' }"
            >
              Sign up
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>
.

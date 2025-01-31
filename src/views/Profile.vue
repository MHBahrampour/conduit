<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import {
  fetchProfile,
  fetchArticlesByAuthor,
  fetchFavoritedArticles,
} from "@/services/profileServices";
import { ref, computed } from "vue";
import ArticlePreview from "@/components/ArticlePreview.vue";

const ARTICLES_PER_PAGE = 5;

const route = useRoute();
const username = route.params.username as string;

const selectedTab = ref<"my-articles" | "favorited-articles">("my-articles");
const currentPage = ref(1);

const { data: profile } = useQuery({
  queryKey: ["profile", username],
  queryFn: () => fetchProfile(username),
});

const { data: myArticles } = useQuery({
  queryKey: ["my-articles", currentPage],
  queryFn: () =>
    fetchArticlesByAuthor(username, currentPage.value, ARTICLES_PER_PAGE),
});

const { data: favoritedArticles } = useQuery({
  queryKey: ["favorited-articles", currentPage],
  queryFn: () =>
    fetchFavoritedArticles(username, currentPage.value, ARTICLES_PER_PAGE),
});

const selectedTabData = computed(() =>
  selectedTab.value === "my-articles"
    ? myArticles.value
    : favoritedArticles.value
);

const totalPages = computed(() =>
  Math.ceil((selectedTabData?.value?.articlesCount || 0) / ARTICLES_PER_PAGE)
);
</script>

<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img
              :src="profile?.image || 'https://via.placeholder.com/50'"
              class="user-img"
            />
            <h4>{{ profile?.username }}</h4>
            <p>{{ profile?.bio }}</p>
            <button
              v-if="!profile?.following"
              class="btn btn-sm btn-outline-secondary action-btn"
            >
              <i class="ion-plus-round"></i>&nbsp; Follow
              {{ profile?.username }}
            </button>
            <button v-else class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-minus-round"></i>&nbsp; Unfollow
              {{ profile?.username }}
            </button>
            <button
              v-if="profile?.username === username"
              class="btn btn-sm btn-outline-secondary action-btn"
              @click="$router.push('/settings')"
            >
              <i class="ion-gear-a"></i>&nbsp; Edit Profile Settings
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: selectedTab === 'my-articles' }"
                  @click="selectedTab = 'my-articles'"
                >
                  My Articles
                </a>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: selectedTab === 'favorited-articles' }"
                  @click="selectedTab = 'favorited-articles'"
                >
                  Favorited Articles
                </a>
              </li>
            </ul>
          </div>

          <ArticlePreview
            v-for="article in selectedTabData?.articles"
            :key="article.slug"
            :article="article"
            :currentPage="currentPage"
          />

          <div
            v-if="selectedTabData?.articlesCount === 0"
            class="article-preview"
          >
            <p class="text-center">No articles are here... yet.</p>
          </div>

          <ul v-if="totalPages > 1" class="pagination">
            <li
              v-for="page in totalPages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" @click="currentPage = page">{{ page }}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

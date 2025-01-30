<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import {
  fetchGlobalArticles,
  fetchYourArticles,
} from "@/services/articleServices";
import { fetchTags } from "@/services/tagServices";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";

type ActiveFeed = "global-feed" | "your-feed";

interface Feed {
  key: ActiveFeed;
  name: string;
}

const ARTICLES_PER_PAGE = 5;

const { isLoggedIn } = useAuth();

const activeFeed = ref<ActiveFeed>("global-feed");
const currentPage = ref(1);

const feeds = computed(() => {
  const feedList: Feed[] = [{ name: "Global Feed", key: "global-feed" }];
  if (isLoggedIn.value) {
    feedList.unshift({ name: "Your Feed", key: "your-feed" });
    activeFeed.value = "your-feed";
  }
  return feedList;
});

const { data: globalFeed } = useQuery({
  queryFn: () => fetchGlobalArticles(currentPage.value, ARTICLES_PER_PAGE),
  queryKey: ["global-articles", currentPage],
});

const { data: yourFeed } = useQuery({
  queryFn: () => fetchYourArticles(currentPage.value, ARTICLES_PER_PAGE),
  queryKey: ["your-articles", currentPage],
  enabled: isLoggedIn.value,
});

const { data: tags } = useQuery({
  queryFn: fetchTags,
  queryKey: ["tags"],
});

const setActiveFeed = (feedKey: ActiveFeed) => {
  activeFeed.value = feedKey;
};

const activeFeedData = computed(() =>
  activeFeed.value === "global-feed" ? globalFeed.value : yourFeed.value
);

const totalPages = computed(() =>
  Math.ceil((activeFeedData.value?.articlesCount || 0) / ARTICLES_PER_PAGE)
);

const noArticleMessage = computed(() =>
  activeFeed.value === "global-feed"
    ? "Ops! No articles are here... yet."
    : "You don't have any articles yet. Follow an author or favorite an article to get started."
);
</script>

<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li v-for="feed in feeds" :key="feed.key" class="nav-item">
                <a
                  class="nav-link"
                  :class="{ active: activeFeed === feed.key }"
                  href="#"
                  @click.prevent="setActiveFeed(feed.key)"
                >
                  {{ feed.name }}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div
              v-if="activeFeedData?.articlesCount === 0"
              class="article-preview"
            >
              <p>{{ noArticleMessage }}</p>
            </div>
            <div
              v-else
              v-for="article in activeFeedData?.articles"
              :key="article.slug"
              class="article-preview"
            >
              <div class="article-meta">
                <router-link
                  :to="`/profile/${article.author.username}`"
                  class="nav-link"
                >
                  <img
                    :src="article.author.image"
                    :alt="article.author.username"
                  />
                </router-link>
                <div class="info">
                  <router-link
                    :to="`/profile/${article.author.username}`"
                    class="nav-link"
                  >
                    {{ article.author.username }}
                  </router-link>
                  <span class="date">{{
                    new Date(article.createdAt).toDateString()
                  }}</span>
                </div>
                <button class="btn btn-outline-primary btn-sm pull-xs-right">
                  <i class="ion-heart"></i> {{ article.favoritesCount }}
                </button>
              </div>
              <router-link
                :to="`/article/${article.slug}`"
                class="preview-link"
              >
                <h1>{{ article.title }}</h1>
                <p>{{ article.description }}</p>
                <span>Read more...</span>
                <ul class="tag-list">
                  <li
                    v-for="tag in article.tagList"
                    :key="tag"
                    class="tag-default tag-pill tag-outline"
                  >
                    {{ tag }}
                  </li>
                </ul>
              </router-link>
            </div>
          </div>

          <ul class="pagination">
            <li
              v-for="page in totalPages"
              :key="page"
              :class="['page-item', { active: currentPage === page }]"
            >
              <a class="page-link" href="#" @click.prevent="currentPage = page">
                {{ page }}
              </a>
            </li>
          </ul>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <a
                v-for="tag in tags"
                :key="tag"
                href=""
                class="tag-pill tag-default"
                >{{ tag }}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import {
  favoriteArticle,
  unfavoriteArticle,
  fetchUserFavoritedArticles,
} from "@/services/articleServices";
import type { Article } from "@/types/articleTypes";
import { fetchCurrentUser } from "@/services/authServices";
import { computed } from "vue";

const props = defineProps<{
  article: Article;
  currentPage: number;
}>();

const queryClient = useQueryClient();

const { data: currentUser } = useQuery({
  queryFn: fetchCurrentUser,
  queryKey: ["current-user"],
});

const { data: favoritedArticles } = useQuery({
  queryKey: ["favorited-articles"],
  queryFn: () => fetchUserFavoritedArticles(currentUser.value?.username!),
  enabled: computed(() => !!currentUser.value?.username),
});

const favoriteMutation = useMutation({
  mutationFn: favoriteArticle,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["global-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["my-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["favorited-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["favorited-articles"],
    });
  },
});

const unfavoriteMutation = useMutation({
  mutationFn: unfavoriteArticle,
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["global-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["my-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["favorited-articles", props.currentPage],
    });
    queryClient.invalidateQueries({
      queryKey: ["favorited-articles"],
    });
  },
});

const toggleFavorite = () => {
  if (!currentUser.value?.username) {
    alert("Please login to favorite/unfavorite an article");
    return;
  }

  const isFavorited = favoritedArticles?.value?.articles?.some(
    (a) => a.slug === props.article.slug
  );

  isFavorited
    ? unfavoriteMutation.mutate(props.article.slug)
    : favoriteMutation.mutate(props.article.slug);
};
</script>

<template>
  <div class="article-preview">
    <div class="article-meta">
      <router-link :to="`/profile/${article.author.username}`" class="nav-link">
        <img :src="article.author.image" :alt="article.author.username" />
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
      <button
        @click="toggleFavorite"
        class="btn btn-outline-primary btn-sm pull-xs-right"
      >
        <i class="ion-heart"></i> {{ article.favoritesCount }}
      </button>
    </div>
    <router-link :to="`/article/${article.slug}`" class="preview-link">
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
</template>

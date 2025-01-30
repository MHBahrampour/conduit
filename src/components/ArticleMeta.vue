<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  article: {
    type: Object,
    required: true,
  },
  isCurrentUserTheAuthor: {
    type: Boolean,
    required: true,
  },
});
</script>

<template>
  <div class="article-meta">
    <router-link :to="`/profile/${article?.author?.username}`" class="author">
      <img :src="article?.author?.image" />
    </router-link>
    <div class="info">
      <router-link :to="`/profile/${article?.author?.username}`" class="author">
        {{ article?.author?.username }}
      </router-link>
      <span class="date">{{ article?.createdAt }}</span>
    </div>

    <button class="btn btn-sm btn-outline-secondary">
      <i class="ion-plus-round"></i>
      {{ article?.author?.following ? "Unfollow" : "Follow" }}
      {{ article?.author?.username }}
    </button>

    &nbsp;

    <button class="btn btn-sm btn-outline-primary">
      <i class="ion-heart"></i>
      &nbsp; {{ article?.favoritesCount ? "Unfavorite" : "Favorite" }}
      <span class="counter">({{ article?.favoritesCount }})</span>
    </button>

    <template v-if="isCurrentUserTheAuthor">
      <button class="btn btn-sm btn-outline-secondary">
        <i class="ion-edit"></i> Edit Article
      </button>
      <button class="btn btn-sm btn-outline-danger">
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { handleError } from "@/lib/handleError";
import { deleteArticle } from "@/services/articleServices";
import { fetchCurrentUser } from "@/services/authServices";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { computed, defineProps } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  isCurrentUserTheAuthor: {
    type: Boolean,
    required: true,
  },
});

const router = useRouter();

const { data: currentUser } = useQuery({
  queryFn: () => fetchCurrentUser(),
  queryKey: ["currentUser"],
});

const deleteArticleMutation = useMutation({
  mutationFn: deleteArticle,
  onSuccess: () => {
    router.push("/");
    alert("Article deleted successfully!");
  },
  onError: (error) => {
    handleError(error);
  },
});

const isCurrentUserTheAuthor = computed(() => {
  return currentUser.value?.username === props.article?.author?.username;
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
      <span class="date">{{
        new Date(article?.createdAt).toLocaleString()
      }}</span>
    </div>

    <button
      v-if="!isCurrentUserTheAuthor"
      class="btn btn-sm btn-outline-secondary"
    >
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
      <button
        @click="router.push(`/editor/${article?.slug}`)"
        class="btn btn-sm btn-outline-secondary"
      >
        <i class="ion-edit"></i> Edit Article
      </button>
      <button
        @click="deleteArticleMutation.mutate(article?.slug)"
        class="btn btn-sm btn-outline-danger"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

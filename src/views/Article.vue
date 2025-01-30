<script setup lang="ts">
import ArticleMeta from "@/components/ArticleMeta.vue";
import { handleError } from "@/lib/handleError";
import { fetchArticle } from "@/services/articleServices";
import { fetchCurrentUser } from "@/services/authServices";
import {
  deleteComment,
  fetchComments,
  postComment,
} from "@/services/commentServices";
import type { Comment } from "@/types/commentTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const queryClient = useQueryClient();

const slug = route.params.slug as string | undefined;

const commentMessage = ref("");

const { data: article, isLoading: articleLoading } = useQuery({
  queryFn: () => fetchArticle(slug!),
  queryKey: ["article", slug],
  enabled: !!slug,
});

const { data: comments, isLoading: commentsLoading } = useQuery({
  queryFn: () => fetchComments(slug!),
  queryKey: ["comments", slug],
  enabled: !!slug,
});

const postCommnetMutation = useMutation({
  mutationFn: postComment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    alert("Comment posted successfully!");
  },
  onError: handleError,
});

const deleteCommentMutation = useMutation({
  mutationFn: deleteComment,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["comments", slug] });
    alert("Comment deleted successfully!");
  },
  onError: handleError,
});

const { data: currentUser } = useQuery({
  queryFn: () => fetchCurrentUser(),
  queryKey: ["currentUser"],
});

const handlePostComment = () => {
  postCommnetMutation.mutate({
    slug: slug!,
    payload: {
      body: commentMessage.value,
    },
  });
};

const handleDeleteComment = (commentId: string) => {
  deleteCommentMutation.mutate({
    slug: slug!,
    commentId,
  });
};

const isCurrentUserTheAuthor = computed(() => {
  return currentUser.value?.username === article?.value?.author?.username;
});
</script>

<template>
  <div class="article-page">
    <div v-if="articleLoading">Loading...</div>
    <div v-else>
      <div class="banner">
        <div class="container">
          <h1>{{ article?.title }}</h1>

          <ArticleMeta
            :article="article!"
            :isCurrentUserTheAuthor="isCurrentUserTheAuthor"
          />
        </div>
      </div>

      <div class="container page">
        <div class="row article-content">
          <div class="col-md-12">
            <p>{{ article?.body }}</p>
            <h2 id="introducing-ionic">{{ article?.title }}</h2>
            <p>{{ article?.description }}</p>
            <ul class="tag-list">
              <li
                v-for="tag in article?.tagList"
                :key="tag"
                class="tag-default tag-pill tag-outline"
              >
                {{ tag }}
              </li>
            </ul>
          </div>
        </div>

        <hr />

        <div class="article-actions">
          <ArticleMeta
            :article="article!"
            :isCurrentUserTheAuthor="isCurrentUserTheAuthor"
          />
        </div>

        <div class="row">
          <div class="col-xs-12 col-md-8 offset-md-2">
            <form @submit.prevent="handlePostComment" class="card comment-form">
              <div class="card-block">
                <textarea
                  class="form-control"
                  placeholder="Write a comment..."
                  rows="3"
                  v-model="commentMessage"
                ></textarea>
              </div>
              <div class="card-footer">
                <img
                  :src="currentUser?.image || ''"
                  class="comment-author-img"
                />
                <button type="submit" class="btn btn-sm btn-primary">
                  Post Comment
                </button>
              </div>
            </form>

            <div v-if="commentsLoading" class="card">Loading Comments...</div>
            <div
              v-else
              v-for="comment in comments"
              :key="comment.id"
              class="card"
            >
              <div class="card-block">
                <p class="card-text">{{ comment.body }}</p>
              </div>
              <div class="card-footer">
                <a href="" class="comment-author">
                  <img :src="comment.author.image" class="comment-author-img" />
                </a>
                &nbsp;
                <a href="" class="comment-author">{{
                  comment.author.username
                }}</a>
                <span class="date-posted">
                  {{ new Date(comment.createdAt).toLocaleString() }}
                </span>
                <span
                  v-if="currentUser?.username === comment.author.username"
                  @click="handleDeleteComment(comment.id)"
                  class="mod-options"
                >
                  <i class="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

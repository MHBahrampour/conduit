<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { watchEffect } from "vue";
import { ErrorMessage, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { handleError } from "@/lib/handleError";
import {
  createArticle,
  fetchArticle,
  updateArticle,
} from "@/services/articleServices";

const route = useRoute();
const router = useRouter();
const slug = route.params.slug as string | undefined;
const isEditMode = !!slug;

const { data: article } = useQuery({
  queryFn: () => fetchArticle(slug!),
  queryKey: ["article", slug],
  enabled: isEditMode,
});

const schema = toTypedSchema(
  z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    body: z.string().min(1, "Body is required"),
    tagList: z.string().min(1, "Tags are required"),
  })
);

const form = useForm({
  validationSchema: schema,
  initialValues: {
    title: "",
    description: "",
    body: "",
    tagList: "",
  },
});

const [title, titleAttrs] = form.defineField("title");
const [description, descriptionAttrs] = form.defineField("description");
const [body, bodyAttrs] = form.defineField("body");
const [tagList, tagListAttrs] = form.defineField("tagList");

const createArticleMutation = useMutation({
  mutationFn: createArticle,
  onSuccess: (article) => {
    alert("Create article successfu!");
    router.push({ name: "Article", params: { slug: article.slug } });
  },
  onError: handleError,
});

const updateArticleMutation = useMutation({
  mutationFn: updateArticle,
  onSuccess: (article) => {
    alert("Update article successfu!");
    router.push({ name: "Article", params: { slug: article.slug } });
  },
  onError: handleError,
});

const onSubmit = form.handleSubmit((data) => {
  console.log("submit data:", data);
  if (isEditMode) {
    console.log("update article", slug);
    updateArticleMutation.mutate({
      slug,
      payload: {
        ...data,
        tagList: data.tagList.split(",").map((tag) => tag.trim()),
      },
    });
  } else {
    console.log("create article");
    createArticleMutation.mutate({
      ...data,
      tagList: data.tagList.split(",").map((tag) => tag.trim()),
    });
  }
});

watchEffect(() => {
  if (article.value) {
    form.setValues({
      title: article.value.title,
      description: article.value.description,
      body: article.value.body,
      tagList: article.value.tagList.join(", "),
    });
  }
});
</script>

<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <li v-for="field in Object.keys(form.errors.value)" :key="field">
              <ErrorMessage :name="field" />
            </li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="title"
                  v-bind="titleAttrs"
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="description"
                  v-bind="descriptionAttrs"
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="body"
                  v-bind="bodyAttrs"
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="tagList"
                  v-bind="tagListAttrs"
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                />
                <div class="tag-list">
                  <span
                    v-for="tag in article?.tagList"
                    :key="tag"
                    class="tag-default tag-pill"
                  >
                    <i class="ion-close-round"></i> {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
                :disabled="
                  isEditMode
                    ? updateArticleMutation.isPending.value
                    : createArticleMutation.isPending.value
                "
              >
                {{ isEditMode ? "Update Article" : "Publish Article" }}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

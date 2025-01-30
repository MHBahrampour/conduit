<script setup lang="ts">
import { useAuth } from "@/composables/useAuth";
import { handleError } from "@/lib/handleError";
import { fetchCurrentUser, updateUser } from "@/services/authServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, useForm } from "vee-validate";
import { watchEffect } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const router = useRouter();
const queryClient = useQueryClient();
const { clearToken } = useAuth();

const { data: currentUser } = useQuery({
  queryKey: ["currentUser"],
  queryFn: fetchCurrentUser,
});

const schema = toTypedSchema(
  z.object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .min(5, "Email must be at least 5 characters")
      .email("Invalid email address")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional()
      .or(z.literal("")),
    bio: z.string().optional().or(z.literal("")),
    image: z.string().optional().or(z.literal("")),
  })
);

const form = useForm({
  validationSchema: schema,
  initialValues: {
    username: "",
    email: "",
    password: "",
    bio: "",
    image: "",
  },
});

const [username, usernameAttrs] = form.defineField("username");
const [email, emailAttrs] = form.defineField("email");
const [password, passwordAttrs] = form.defineField("password");
const [bio, bioAttrs] = form.defineField("bio");
const [image, imageAttrs] = form.defineField("image");

const updateUserMutation = useMutation({
  mutationFn: updateUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    alert("Update successful!");
  },
  onError: handleError,
});

const onSubmit = form.handleSubmit((data) => {
  updateUserMutation.mutate({
    user: {
      ...data,
    },
  });
});

const handleLogout = () => {
  clearToken();
  alert("Logout successful!");
  router.push({ name: "Home" });
};

watchEffect(() => {
  if (currentUser.value) {
    form.setValues({
      username: currentUser.value.username,
      email: currentUser.value.email,
      password: undefined,
      bio: currentUser.value.bio || undefined,
      image: currentUser.value.image || undefined,
    });
  }
});
</script>

<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>

          <ul class="error-messages">
            <li v-for="field in Object.keys(form.errors.value)" :key="field">
              <ErrorMessage :name="field" />
            </li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  v-model="image"
                  v-bind="imageAttrs"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="username"
                  v-bind="usernameAttrs"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="bio"
                  v-bind="bioAttrs"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="email"
                  v-bind="emailAttrs"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Email"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="password"
                  v-bind="passwordAttrs"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="New Password"
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr />
          <button class="btn btn-outline-danger" @click="handleLogout">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

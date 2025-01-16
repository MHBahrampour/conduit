<script setup lang="ts">
import { ErrorMessage, useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/vue-query";
import { registerUser } from "@/services/auth";
import { handleError } from "@/lib/handleError";
import { useRouter } from "vue-router";

const router = useRouter();

const schema = toTypedSchema(
  z.object({
    username: z
      .string()
      .nonempty("Username is required")
      .min(3, "Username must be at least 3 characters"),
    email: z
      .string()
      .nonempty("Email is required")
      .min(5, "Email must be at least 5 characters")
      .email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
);

const form = useForm({
  validationSchema: schema,
  initialValues: {
    username: "mmd",
    email: "mmd@ex.com",
    password: "akvnio82394",
  },
});

const [username, usernameAttrs] = form.defineField("username");
const [email, emailAttrs] = form.defineField("email");
const [password, passwordAttrs] = form.defineField("password");

const registerMutation = useMutation({
  mutationFn: registerUser,
  onSuccess: (data) => {
    localStorage.setItem("conduit-token", data.user.token);
    alert("Registration successful!");
    router.push("/");
  },
  onError: handleError,
});

const onSubmit = form.handleSubmit((data) => {
  registerMutation.mutate({
    user: {
      ...data,
    },
  });
});
</script>

<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <router-link to="/login">Have an account?</router-link>
          </p>

          <ul class="error-messages">
            <li v-for="field in Object.keys(form.errors.value)" :key="field">
              <ErrorMessage :name="field" />
            </li>
          </ul>

          <form @submit.prevent="onSubmit">
            <fieldset class="form-group">
              <input
                v-model="username"
                v-bind="usernameAttrs"
                class="form-control form-control-lg"
                type="text"
                placeholder="Username"
              />
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
                placeholder="Password"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

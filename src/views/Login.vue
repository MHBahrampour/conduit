<script setup lang="ts">
import { z } from "zod";
import { handleError } from "@/lib/handleError";
import { loginUser } from "@/services/auth";
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
import { ErrorMessage, useForm } from "vee-validate";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth";

const router = useRouter();
const { setToken } = useAuth();

const schema = toTypedSchema(
  z.object({
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
    email: "mmd@ex.com",
    password: "akvnio82394",
  },
});

const [email, emailAttrs] = form.defineField("email");
const [password, passwordAttrs] = form.defineField("password");

const loginMutation = useMutation({
  mutationFn: loginUser,
  onSuccess: (user) => {
    setToken(user.token);
    alert("Login successful!");
    router.push("/");
  },
  onError: handleError,
});

const onSubmit = form.handleSubmit((data) => {
  loginMutation.mutate({
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
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <a href="/register">Need an account?</a>
          </p>

          <ul class="error-messages">
            <li v-for="field in Object.keys(form.errors.value)" :key="field">
              <ErrorMessage :name="field" />
            </li>
          </ul>

          <form @submit.prevent="onSubmit">
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
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

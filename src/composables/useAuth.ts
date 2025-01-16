import { ref, computed } from "vue";

const token = ref(localStorage.getItem("conduit-token"));

export function useAuth() {
  const isLoggedIn = computed(() => !!token.value);

  const setToken = (newToken: string) => {
    token.value = newToken;
    localStorage.setItem("conduit-token", newToken);
  };

  const clearToken = () => {
    token.value = null;
    localStorage.removeItem("conduit-token");
  };

  return { token, isLoggedIn, setToken, clearToken };
}

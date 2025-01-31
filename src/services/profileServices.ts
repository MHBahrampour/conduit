import type { Profile } from "@/types/profileTypes";
import api from "./api";
import type { ArticlesResponse } from "@/types/articleTypes";

export const fetchProfile = async (username: string): Promise<Profile> => {
  const { data } = await api.get<{ profile: Profile }>(`/profiles/${username}`);
  return data.profile;
};

export const fetchArticlesByAuthor = async (
  username: string,
  page: number,
  limit: number
): Promise<ArticlesResponse> => {
  const { data } = await api.get<ArticlesResponse>(
    `/articles?author=${username}&limit=${limit}&offset=${(page - 1) * limit}`
  );
  return data;
};

export const fetchFavoritedArticles = async (
  username: string,
  page: number,
  limit: number
): Promise<ArticlesResponse> => {
  const { data } = await api.get<ArticlesResponse>(
    `/articles?favorited=${username}&limit=${limit}&offset=${
      (page - 1) * limit
    }`
  );
  return data;
};

export const followUser = async (username: string): Promise<Profile> => {
  const { data } = await api.post<{ profile: Profile }>(
    `/profiles/${username}/follow`
  );
  return data.profile;
};

export const unfollowUser = async (username: string): Promise<Profile> => {
  const { data } = await api.delete<{ profile: Profile }>(
    `/profiles/${username}/follow`
  );
  return data.profile;
};

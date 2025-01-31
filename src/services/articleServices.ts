import type {
  Article,
  ArticlesResponse,
  CreateArticlePayload,
  SingleArticleResponse,
  UpdateArticlePayload,
} from "@/types/articleTypes";
import api from "./api";

export async function fetchGlobalArticles(
  page: number,
  limit: number
): Promise<ArticlesResponse> {
  const offset = (page - 1) * limit;
  const response = await api.get<ArticlesResponse>(
    `/articles?limit=${limit}&offset=${offset}`
  );
  return response.data;
}

export async function fetchYourArticles(
  page: number,
  limit: number
): Promise<ArticlesResponse> {
  const offset = (page - 1) * limit;
  const response = await api.get<ArticlesResponse>(
    `/articles/feed?limit=${limit}&offset=${offset}`
  );
  return response.data;
}

export async function fetchArticle(slug: string): Promise<Article> {
  const response = await api.get<SingleArticleResponse>(`/articles/${slug}`);
  return response.data.article;
}

export async function createArticle(
  payload: CreateArticlePayload
): Promise<Article> {
  const response = await api.post<SingleArticleResponse>("/articles", {
    article: payload,
  });
  return response.data.article;
}

export async function updateArticle({
  slug,
  payload,
}: {
  slug: string;
  payload: UpdateArticlePayload;
}): Promise<Article> {
  const response = await api.put<SingleArticleResponse>(`/articles/${slug}`, {
    article: payload,
  });
  return response.data.article;
}

export async function favoriteArticle(slug: string): Promise<Article> {
  const response = await api.post<SingleArticleResponse>(
    `/articles/${slug}/favorite`
  );
  return response.data.article;
}

export async function unfavoriteArticle(slug: string): Promise<Article> {
  const response = await api.delete<SingleArticleResponse>(
    `/articles/${slug}/favorite`
  );
  return response.data.article;
}

export async function fetchUserFavoritedArticles(
  username: string
): Promise<ArticlesResponse> {
  const response = await api.get<ArticlesResponse>(
    `/articles?favorited=${username}`
  );
  return response.data;
}

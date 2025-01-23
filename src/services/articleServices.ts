import type { ArticlesResponse } from "@/types/articleTypes";
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

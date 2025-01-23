import api from "./api";
import type { TagsResponse } from "@/types/tagTypes";

export async function fetchTags(): Promise<string[]> {
  const response = await api.get<TagsResponse>("/tags");
  return response.data.tags;
}

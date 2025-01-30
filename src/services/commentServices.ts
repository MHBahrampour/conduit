import api from "./api";
import type { Comment, PostCommentPayload } from "@/types/commentTypes";

export const fetchComments = async (slug: string): Promise<Comment[]> => {
  const response = await api.get(`/articles/${slug}/comments`);
  return response.data.comments;
};

export const postComment = async ({
  slug,
  payload,
}: {
  slug: string;
  payload: PostCommentPayload;
}): Promise<Comment> => {
  const response = await api.post(`/articles/${slug}/comments`, {
    comment: payload,
  });
  return response.data.comment;
};

export const deleteComment = async ({
  slug,
  commentId,
}: {
  slug: string;
  commentId: string;
}): Promise<void> => {
  await api.delete(`/articles/${slug}/comments/${commentId}`);
};

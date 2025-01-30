export interface Comment {
  id: string;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
}

export interface PostCommentPayload {
  body: string;
}

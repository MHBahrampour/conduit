export interface Article {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio: string | null;
    image: string;
    following: boolean;
  };
}

export interface SingleArticleResponse {
  article: Article;
}

export interface ArticlesResponse {
  articles: Article[];
  articlesCount: number;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export type UpdateArticlePayload = Partial<CreateArticlePayload>;

// Request Payload Types
export interface RegisterPayload {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface LoginPayload {
  user: {
    email: string;
    password: string;
  };
}

export interface UpdateUserPayload {
  user: Partial<{
    username: string;
    email: string;
    password: string;
    bio: string;
    image: string;
  }>;
}

// Response Types
export interface User {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
}

export interface RegisterResponse {
  user: User;
}

export interface LoginResponse {
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

export interface UpdateUserResponse {
  user: User;
}

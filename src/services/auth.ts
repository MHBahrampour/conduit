import api from "./api";
import {
  type RegisterPayload,
  type RegisterResponse,
  type LoginPayload,
  type LoginResponse,
  type CurrentUserResponse,
  type UpdateUserPayload,
  type UpdateUserResponse,
  type User,
} from "@/types/auth";

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const response = await api.post<RegisterResponse>("/users", payload);
  return response.data.user;
}

export async function loginUser(payload: LoginPayload): Promise<User> {
  const response = await api.post<LoginResponse>("/users/login", payload);
  return response.data.user;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<CurrentUserResponse>("/user");
  return response.data.user;
}

export async function updateUser(payload: UpdateUserPayload): Promise<User> {
  const response = await api.put<UpdateUserResponse>("/user", payload);
  return response.data.user;
}

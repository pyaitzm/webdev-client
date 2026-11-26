import axios from "axios";
import type { User } from "./AccountContext";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${HTTP_SERVER}/api/users`;

type Credentials = { username: string; password: string };

export const signin = async (credentials: Credentials) => {
  const response = await axiosWithCredentials.post<User>(
    `${USERS_API}/signin`,
    credentials,
  );
  return response.data;
};

export const signup = async (user: Credentials) => {
  const response = await axiosWithCredentials.post<User>(
    `${USERS_API}/signup`,
    user,
  );
  return response.data;
};

export const updateUser = async (user: User) => {
  const response = await axiosWithCredentials.put<User>(
    `${USERS_API}/${user._id}`,
    user,
  );
  return response.data;
};

export const profile = async () => {
  const response = await axiosWithCredentials.get<User>(`${USERS_API}/profile`);
  return response.data;
};

export const signout = async () => {
  const response = await axiosWithCredentials.post(`${USERS_API}/signout`);
  return response.data;
};

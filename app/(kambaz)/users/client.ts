import axios from "axios";
import type { User } from "../account/AccountContext";
export type Person = Omit<User, "password">;
const http = axios.create({ withCredentials: true });
const SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const USERS_API = `${SERVER}/api/users`;
const COURSES_API = `${SERVER}/api/courses`;
export const findUsersForCourse = async (courseId: string) => {
  const { data } = await http.get<Person[]>(`${COURSES_API}/${courseId}/users`);
  return data;
};
export const createUserForCourse = async (
  courseId: string,
  user: Partial<User>,
) => {
  const { data } = await http.post<Person>(
    `${COURSES_API}/${courseId}/users`,
    user,
  );
  return data;
};
export const updateUser = async (userId: string, updates: Partial<User>) => {
  const { data } = await http.put<Person>(`${USERS_API}/${userId}`, updates);
  return data;
};
export const deleteUser = async (userId: string) => {
  await http.delete(`${USERS_API}/${userId}`);
};

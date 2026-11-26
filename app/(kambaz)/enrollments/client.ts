import axios from "axios";
const http = axios.create({ withCredentials: true });
const USERS_API = `${process.env.NEXT_PUBLIC_HTTP_SERVER}/api/users`;
export const enrollIntoCourse = async (userId: string, courseId: string) => {
  await http.post(`${USERS_API}/${userId}/courses/${courseId}`);
};
export const unenrollFromCourse = async (userId: string, courseId: string) => {
  await http.delete(`${USERS_API}/${userId}/courses/${courseId}`);
};

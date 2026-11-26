import axios from "axios";
import type { Assignment, AssignmentDraft } from "../store/assignmentsStore";
import type { CourseModule } from "../store/modulesStore";
import type { Course } from "../store/coursesStore";

const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;
const USERS_API = `${HTTP_SERVER}/api/users`;

export const fetchAllCourses = async () => {
  const { data } = await axios.get<Course[]>(COURSES_API);
  return data;
};
export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get<Course[]>(
    `${USERS_API}/current/courses`,
  );
  return data;
};
export const createCourse = async (course: Course) => {
  const { data } = await axiosWithCredentials.post<Course>(
    `${USERS_API}/current/courses`,
    course,
  );
  return data;
};
export const deleteCourse = async (courseId: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${courseId}`);
  return data;
};
export const updateCourse = async (course: Course) => {
  const { data } = await axios.put<Course>(
    `${COURSES_API}/${course._id}`,
    course,
  );
  return data;
};
import { enrollIntoCourse, unenrollFromCourse } from "../enrollments/client";
export { enrollIntoCourse, unenrollFromCourse };
export const enroll = (courseId: string) =>
  enrollIntoCourse("current", courseId);
export const unenroll = (courseId: string) =>
  unenrollFromCourse("current", courseId);
export const findModulesForCourse = async (courseId: string) => {
  const { data } = await axios.get<CourseModule[]>(
    `${COURSES_API}/${courseId}/modules`,
  );
  return data;
};
export const createModuleForCourse = async (
  courseId: string,
  module: { name: string },
) => {
  const { data } = await axios.post<CourseModule>(
    `${COURSES_API}/${courseId}/modules`,
    module,
  );
  return data;
};
export const deleteModule = async (moduleId: string) => {
  const { data } = await axios.delete(`${MODULES_API}/${moduleId}`);
  return data;
};
export const updateModule = async (
  module: Pick<CourseModule, "_id" | "name">,
) => {
  const { data } = await axios.put<CourseModule>(
    `${MODULES_API}/${module._id}`,
    module,
  );
  return data;
};

const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;
export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get<Assignment[]>(
    `${COURSES_API}/${courseId}/assignments`,
  );
  return data;
};
export const createAssignmentForCourse = async (
  courseId: string,
  assignment: AssignmentDraft,
) => {
  const { data } = await axios.post<Assignment>(
    `${COURSES_API}/${courseId}/assignments`,
    assignment,
  );
  return data;
};
export const updateAssignment = async (assignment: Assignment) => {
  const { data } = await axios.put<Assignment>(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment,
  );
  return data;
};
export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

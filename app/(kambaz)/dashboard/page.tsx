"use client";

import { useCallback, useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import { useAccountContext } from "../account/AccountContext";
import * as client from "../courses/client";
import * as enrollments from "../enrollments/client";
import {
  emptyCourse,
  useCoursesStore,
  type Course,
} from "../store/coursesStore";

export default function Dashboard() {
  const courses = useCoursesStore((state) => state.courses);
  const addCourse = useCoursesStore((state) => state.addCourse);
  const updateCourse = useCoursesStore((state) => state.updateCourse);
  const [course, setCourse] = useState<Course>(emptyCourse);
  const { currentUser } = useAccountContext();
  const setCourses = useCoursesStore((state) => state.setCourses);
  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [error, setError] = useState("");

  const loadCourses = useCallback(async () => {
    const mine = currentUser ? await client.findMyCourses() : [];
    const visible =
      !currentUser || showAllCourses ? await client.fetchAllCourses() : mine;
    setEnrolledIds(mine.map((c) => c._id));
    setCourses(visible);
  }, [currentUser, showAllCourses, setCourses]);

  useEffect(() => {
    setCourses([]);
    setEnrolledIds([]);
    setError("");
    void loadCourses().catch(() => setError("Unable to load courses"));
  }, [loadCourses, setCourses]);

  const onAddCourse = async () => {
    if (!currentUser) {
      setError("Sign in to create a course");
      return;
    }
    try {
      setError("");
      addCourse(await client.createCourse(course));
      await loadCourses();
    } catch {
      setError("Unable to create course");
    }
  };
  const onUpdateCourse = async () => {
    try {
      setError("");
      updateCourse(await client.updateCourse(course));
      await loadCourses();
    } catch {
      setError("Unable to update course");
    }
  };
  const onDeleteCourse = async (courseId: string) => {
    try {
      setError("");
      await client.deleteCourse(courseId);
      deleteCourse(courseId);
      await loadCourses();
    } catch {
      setError("Unable to delete course");
    }
  };
  const onToggleEnrollment = async (courseId: string) => {
    try {
      setError("");
      if (enrolledIds.includes(courseId))
        await enrollments.unenrollFromCourse("current", courseId);
      else await enrollments.enrollIntoCourse("current", courseId);
      await loadCourses();
    } catch {
      setError("Unable to change enrollment");
    }
  };

  return (
    <div id="wd-dashboard">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 id="wd-dashboard-title">Dashboard</h1>
        <button
          type="button"
          id="wd-enrollments-toggle"
          className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
          onClick={() => setShowAllCourses((show) => !show)}
        >
          Enrollments
        </button>
      </div>
      <hr />
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <h5 className="flex flex-wrap items-center justify-between gap-2">
        New Course
        <span className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            id="wd-update-course-click"
            onClick={onUpdateCourse}
          >
            Update
          </button>
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white"
            id="wd-add-new-course-click"
            onClick={onAddCourse}
          >
            Add
          </button>
        </span>
      </h5>
      <input
        className="mb-2 mt-2 block w-full rounded border border-neutral-300 px-3 py-1.5"
        value={course.name}
        onChange={(e) => setCourse({ ...course, name: e.target.value })}
        id="wd-course-name"
      />
      <textarea
        className="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5"
        rows={3}
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        id="wd-course-description"
      />
      <label
        htmlFor="wd-course-number"
        className="mb-1 block text-sm font-medium"
      >
        Course Number
      </label>
      <input
        id="wd-course-number"
        className="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5"
        value={course.number}
        onChange={(e) => setCourse({ ...course, number: e.target.value })}
      />
      <label
        htmlFor="wd-course-start-date"
        className="mb-1 block text-sm font-medium"
      >
        Start Date
      </label>
      <input
        id="wd-course-start-date"
        type="date"
        className="mb-3 block w-full rounded border border-neutral-300 px-3 py-1.5"
        value={course.startDate}
        onChange={(e) => setCourse({ ...course, startDate: e.target.value })}
      />
      <hr />
      <h2 id="wd-dashboard-published">Published Courses ({courses.length})</h2>
      <hr />
      <div
        id="wd-dashboard-courses"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
      >
        {courses.map((c) => (
          <CourseCard
            key={c._id}
            course={c}
            onEdit={() => setCourse(c)}
            onDelete={() => onDeleteCourse(c._id)}
            isEnrolled={enrolledIds.includes(c._id)}
            onToggleEnrollment={() => onToggleEnrollment(c._id)}
          />
        ))}
      </div>
    </div>
  );
}

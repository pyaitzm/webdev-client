"use client";

import Link from "next/link";
import Image from "next/image";
import { useCoursesStore, type Course } from "../store/coursesStore";
import { useEnrollmentsStore } from "../store/enrollmentsStore";
import { useAccountContext } from "../account/AccountContext";

type CourseCardProps = {
  course: Course;
  onEdit: () => void;
};

export default function CourseCard({ course, onEdit }: CourseCardProps) {
  const deleteCourse = useCoursesStore((state) => state.deleteCourse);
  const { currentUser } = useAccountContext();
  const enrollments = useEnrollmentsStore((state) => state.enrollments);
  const enroll = useEnrollmentsStore((state) => state.enroll);
  const unenroll = useEnrollmentsStore((state) => state.unenroll);
  const isEnrolled =
    !!currentUser &&
    enrollments.some(
      (e) => e.user === currentUser._id && e.course === course._id,
    );

  return (
    <div className="wd-dashboard-course w-[300px] max-w-full overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
      {isEnrolled ? (
        <Link
          href={`/courses/${course._id}/home`}
          className="wd-dashboard-course-link block text-neutral-900 no-underline"
        >
          <Image
            src={course.image}
            width={300}
            height={160}
            alt={course.name}
            className="h-40 w-full object-cover"
          />
          <div className="p-4 pb-0">
            <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
              {course.name}
            </h5>
            <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
              {course.description}
            </p>
          </div>
        </Link>
      ) : (
        <div className="wd-dashboard-course-link block text-neutral-900 no-underline">
          <Image
            src={course.image}
            width={300}
            height={160}
            alt={course.name}
            className="h-40 w-full object-cover"
          />
          <div className="p-4 pb-0">
            <h5 className="wd-dashboard-course-title m-0 mb-2 truncate text-lg font-semibold whitespace-nowrap">
              {course.name}
            </h5>
            <p className="wd-dashboard-course-description m-0 mb-3 h-[100px] overflow-hidden text-sm text-neutral-600">
              {course.description}
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 p-4">
        {isEnrolled ? (
          <Link
            href={`/courses/${course._id}/home`}
            className="inline-flex items-center justify-center rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white no-underline"
          >
            Go
          </Link>
        ) : (
          <span className="rounded bg-neutral-200 px-3 py-1.5 text-sm text-neutral-500">
            Go
          </span>
        )}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser && (
            <button
              type="button"
              className={`rounded px-3 py-1.5 text-sm font-medium text-white ${isEnrolled ? "bg-red-600" : "bg-green-600"}`}
              onClick={() =>
                isEnrolled
                  ? unenroll(currentUser._id, course._id)
                  : enroll(currentUser._id, course._id)
              }
            >
              {isEnrolled ? "Unenroll" : "Enroll"}
            </button>
          )}
          <button
            type="button"
            id="wd-edit-course-click"
            className="rounded bg-yellow-400 px-3 py-1.5 text-sm font-medium"
            onClick={onEdit}
          >
            Edit
          </button>
          <button
            type="button"
            id="wd-delete-course-click"
            className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white"
            onClick={() => deleteCourse(course._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

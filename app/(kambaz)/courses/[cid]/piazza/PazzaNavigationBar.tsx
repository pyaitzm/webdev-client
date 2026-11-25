"use client";

import Link from "next/link";
import type { PazzaCourse, PazzaUser } from "./shared/types";

type PazzaNavigationBarProps = {
  course: PazzaCourse;
  currentUser: PazzaUser | null;
  onShowQuestions: () => void;
};

export default function PazzaNavigationBar({
  course,
  currentUser,
  onShowQuestions,
}: PazzaNavigationBarProps) {
  const isInstructor =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "TA" ||
    currentUser?.role === "ADMIN";
  const userName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`
    : "Guest";

  return (
    <nav
      aria-label="Pazza navigation"
      className="flex flex-wrap items-center gap-4 bg-blue-900 px-4 py-3 text-white"
    >
      <span className="text-xl font-bold">Pazza</span>
      <span className="min-w-0 font-medium">{course.name}</span>
      <button
        type="button"
        onClick={onShowQuestions}
        className="rounded border-b-2 border-white px-2 py-1 font-semibold hover:bg-blue-800"
        aria-current="page"
      >
        Q&amp;A
      </button>
      {isInstructor && (
        <Link
          href={`/courses/${course._id}/piazza/manage/folders`}
          className="rounded px-2 py-1 hover:bg-blue-800"
        >
          Manage Class
        </Link>
      )}
      <span className="ml-auto text-sm" aria-label="Current user">
        {userName}
      </span>
    </nav>
  );
}

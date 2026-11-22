"use client";

import type { ClassAtAGlanceData } from "./shared/componentContracts";

/** Course activity summary using the same temporary data as the post list. */
export default function ClassAtAGlance({
  course,
  posts,
  answers,
  enrolledStudentCount,
  currentUser,
}: ClassAtAGlanceData) {
  const questionIds = new Set(
    posts.filter((post) => post.type === "QUESTION").map((post) => post._id),
  );
  const answeredQuestionIds = new Set(
    answers
      .filter((answer) => questionIds.has(answer.postId))
      .map((answer) => answer.postId),
  );
  const unansweredCount = questionIds.size - answeredQuestionIds.size;
  const instructorResponses = answers.filter(
    (answer) => answer.kind === "INSTRUCTOR",
  ).length;
  const studentResponses = answers.filter(
    (answer) => answer.kind === "STUDENT",
  ).length;
  const unreadCount = currentUser
    ? posts.filter((post) => !post.readByUserIds.includes(currentUser._id))
        .length
    : null;

  const metrics = [
    { label: "Total Posts", value: posts.length },
    { label: "Unanswered Posts", value: unansweredCount },
    { label: "Instructor Responses", value: instructorResponses },
    { label: "Student Responses", value: studentResponses },
    { label: "Enrolled Students", value: enrolledStudentCount },
  ];

  return (
    <section
      aria-labelledby="pazza-glance-title"
      className="max-w-4xl space-y-5"
    >
      <header className="border-b border-gray-200 pb-4">
        <h2
          id="pazza-glance-title"
          className="text-xl font-semibold text-gray-900"
        >
          Class at a Glance
        </h2>
        <p className="mt-1 text-sm text-gray-600">Activity in {course.name}</p>
      </header>

      <div
        className="rounded border border-gray-200 bg-gray-50 p-4"
        aria-label="Unread posts status"
      >
        <h3 className="text-sm font-semibold text-gray-700">Unread Posts</h3>
        {unreadCount === null ? (
          <p className="mt-1 text-sm text-gray-600">
            Sign in to see your unread posts.
          </p>
        ) : (
          <p className="mt-1 text-lg font-semibold text-blue-900">
            {unreadCount === 0
              ? "No unread posts"
              : `${unreadCount} unread ${unreadCount === 1 ? "post" : "posts"}`}
          </p>
        )}
      </div>

      <div
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Course activity statistics"
      >
        {metrics.map(({ label, value }) => (
          <div
            key={label}
            className="rounded border border-gray-200 bg-white p-4"
          >
            <h3 className="text-sm font-medium text-gray-600">{label}</h3>
            <p className="mt-2 text-2xl font-semibold text-blue-900">{value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Preview statistics based on sample Pazza posts and answers and current
        Kambaz enrollments.
      </p>
    </section>
  );
}

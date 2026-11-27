import type { ClassAtAGlanceData } from "./shared/componentContracts";

/**
 * Calculate the five numeric Class at a Glance metrics and the current user's
 * unread count from the records currently supplied by the app.
 *
 * The caller provides only posts visible in the selected course. Answer
 * records are included only when they belong to one of those question posts.
 * This also prevents deleted posts and posts changed to Notes from contributing
 * stale answer counts.
 */
export function calculateClassStatistics({
  course,
  posts,
  answers,
  enrolledStudentCount,
  currentUser,
}: ClassAtAGlanceData) {
  const coursePosts = posts.filter((post) => post.courseId === course._id);
  const questionIds = new Set(
    coursePosts
      .filter((post) => post.type === "QUESTION")
      .map((post) => post._id),
  );
  const questionAnswers = answers.filter(
    (answer) =>
      answer.courseId === course._id && questionIds.has(answer.postId),
  );
  const answeredIds = new Set(questionAnswers.map((answer) => answer.postId));

  return {
    unreadCount: currentUser
      ? coursePosts.filter(
          (post) => !post.readByUserIds.includes(currentUser._id),
        ).length
      : null,
    totalPosts: coursePosts.length,
    unansweredPosts: questionIds.size - answeredIds.size,
    instructorResponses: questionAnswers.filter(
      (answer) => answer.kind === "INSTRUCTOR",
    ).length,
    studentResponses: questionAnswers.filter(
      (answer) => answer.kind === "STUDENT",
    ).length,
    enrolledStudents: enrolledStudentCount,
  };
}

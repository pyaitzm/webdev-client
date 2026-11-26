"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useAccountContext } from "../../../account/AccountContext";
import { useCoursesStore } from "../../../store/coursesStore";
import { useEnrollmentsStore } from "../../../store/enrollmentsStore";
import type { PazzaUser } from "./shared/types";
import type {
  AnswersProps,
  ClassAtAGlanceData,
  FollowUpDiscussionsProps,
} from "./shared/componentContracts";
import {
  mockPazzaPosts,
  mockPazzaDiscussions,
  mockPazzaReplies,
} from "./shared/mockData";
import PazzaNavigationBar from "./PazzaNavigationBar";
import FolderFilters from "./FolderFilters";
import PostListSidebar from "./PostListSidebar";
import NewPostForm from "./NewPostForm";
import PostView from "./PostView";
import ClassAtAGlance from "./ClassAtAGlance";
import usersJson from "../../../database/users.json";
import { usePazzaStore } from "./member-b/pazzaStore";

type Screen = "glance" | "new" | "post";

export default function PazzaShell() {
  const { cid } = useParams<{ cid: string }>();
  // Remount course-specific UI state when navigating between courses.
  return <CoursePazzaShell key={cid} cid={cid} />;
}

function CoursePazzaShell({ cid }: { cid: string }) {
  const course = useCoursesStore((state) =>
    state.courses.find((item) => item._id === cid),
  );
  const { currentUser } = useAccountContext();
  const enrollments = useEnrollmentsStore((state) => state.enrollments);
  const [screen, setScreen] = useState<Screen>("glance");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newPostFolderIds, setNewPostFolderIds] = useState<string[]>([]);
  const sharedFolders = usePazzaStore((state) => state.folders);
  const sharedAnswers = usePazzaStore((state) => state.answers);

  if (!course) return <p>Course not found.</p>;

  // Use only public account fields in the Pazza interface.
  const pazzaUser: PazzaUser | null = currentUser
    ? {
        _id: currentUser._id,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role as PazzaUser["role"],
      }
    : null;
  const pazzaCourse = { _id: course._id, name: course.name };
  const mockFolders = sharedFolders.filter(
    (folder) => folder.courseId === cid,
  );
  // Match the Manage Folders route for courses without existing sample records.
  const folders = mockFolders;
  // Match recipient options to the enrolled users of the current course.
  const enrolledIds = new Set(
    enrollments
      .filter((entry) => entry.course === cid)
      .map((entry) => entry.user),
  );
  const courseUsers: PazzaUser[] = usersJson
    .filter((user) => enrolledIds.has(user._id))
    .map((user) => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role as PazzaUser["role"],
    }));
  const authorizedPosts = mockPazzaPosts.filter(
    (post) =>
      post.courseId === cid &&
      (post.audience === "ENTIRE_CLASS" ||
        (pazzaUser !== null &&
          (post.authorId === pazzaUser._id ||
            post.recipientIds.includes(pazzaUser._id)))),
  );
  const visiblePosts = authorizedPosts.filter(
    (post) =>
      selectedFolderId === null || post.folderIds.includes(selectedFolderId),
  );
  const visiblePostIds = new Set(authorizedPosts.map((post) => post._id));
  const glanceData: ClassAtAGlanceData = {
    course: pazzaCourse,
    posts: authorizedPosts,
    answers: sharedAnswers.filter(
      (answer) => answer.courseId === cid && visiblePostIds.has(answer.postId),
    ),
    enrolledStudentCount: courseUsers.filter((user) => user.role === "STUDENT")
      .length,
    currentUser: pazzaUser,
  };
  const selectedPost = visiblePosts.find((post) => post._id === selectedPostId);
  const answersProps: AnswersProps | null = selectedPost
    ? {
        post: selectedPost,
        course: pazzaCourse,
        currentUser: pazzaUser,
        answers: sharedAnswers.filter(
          (answer) =>
            answer.courseId === cid && answer.postId === selectedPost._id,
        ),
      }
    : null;
  const discussionsProps: FollowUpDiscussionsProps | null = selectedPost
    ? {
        post: selectedPost,
        course: pazzaCourse,
        currentUser: pazzaUser,
        discussions: mockPazzaDiscussions.filter(
          (discussion) =>
            discussion.courseId === cid &&
            discussion.postId === selectedPost._id,
        ),
        replies: mockPazzaReplies.filter(
          (reply) =>
            reply.courseId === cid &&
            mockPazzaDiscussions.some(
              (discussion) =>
                discussion._id === reply.discussionId &&
                discussion.postId === selectedPost._id,
            ),
        ),
      }
    : null;

  const showGlance = () => {
    setSelectedPostId(null);
    setScreen("glance");
  };

  return (
    <section
      id="wd-pazza"
      aria-label="Pazza questions and answers"
      className="min-w-0 border border-gray-200 bg-white"
    >
      <div className="sticky top-0 z-10 bg-white">
        <PazzaNavigationBar
          course={pazzaCourse}
          currentUser={pazzaUser}
          onShowQuestions={showGlance}
        />
        <FolderFilters
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={(folderId) => {
            setSelectedFolderId(folderId);
            setSelectedPostId(null);
            setScreen("glance");
          }}
        />
      </div>
      <div className="flex min-h-[460px] flex-col md:flex-row">
        <PostListSidebar
          key={cid}
          posts={visiblePosts}
          users={courseUsers}
          selectedPostId={screen === "post" ? selectedPostId : null}
          onSelectPost={(postId) => {
            setSelectedPostId(postId);
            setScreen("post");
          }}
          onNewPost={() => {
            setNewPostFolderIds([]);
            setScreen("new");
          }}
        />
        <main className="min-w-0 flex-1 p-5">
          {screen === "glance" && <ClassAtAGlance {...glanceData} />}
          {screen === "new" && (
            <NewPostForm
              key={cid}
              folders={folders}
              users={courseUsers}
              selectedFolderIds={newPostFolderIds}
              onChange={setNewPostFolderIds}
              onCancel={() => {
                setNewPostFolderIds([]);
                showGlance();
              }}
            />
          )}
          {screen === "post" &&
            selectedPost &&
            answersProps &&
            discussionsProps && (
              <PostView
                key={selectedPost._id}
                answersProps={answersProps}
                discussionsProps={discussionsProps}
                folders={folders}
                users={courseUsers}
              />
            )}
        </main>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useAccountContext } from "../../../account/AccountContext";
import { useCoursesStore } from "../../../store/coursesStore";
import { useEnrollmentsStore } from "../../../store/enrollmentsStore";
import {
  canModifyPost,
  canViewPost,
  usePazzaPostsStore,
} from "./store/postsStore";
import type { PazzaPost, PazzaUser } from "./shared/types";
import type {
  AnswersProps,
  ClassAtAGlanceData,
  FollowUpDiscussionsProps,
} from "./shared/componentContracts";
import PazzaNavigationBar from "./PazzaNavigationBar";
import FolderFilters from "./FolderFilters";
import { usePazzaStore } from "./member-b/pazzaStore";
// Date labels depend on the browser timezone. Avoid hydration mismatches.
const PostListSidebar = dynamic(() => import("./PostListSidebar"), {
  ssr: false,
});
import NewPostForm from "./NewPostForm";
import PostView from "./PostView";
import ClassAtAGlance from "./ClassAtAGlance";
import usersJson from "../../../database/users.json";

type Screen = "glance" | "new" | "post" | "edit";

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
  const posts = usePazzaPostsStore((state) => state.posts);
  const addPost = usePazzaPostsStore((state) => state.addPost);
  const openPost = usePazzaPostsStore((state) => state.openPost);
  const updatePost = usePazzaPostsStore((state) => state.updatePost);
  const deletePost = usePazzaPostsStore((state) => state.deletePost);
  const sharedFolders = usePazzaStore((state) => state.folders);
  const sharedAnswers = usePazzaStore((state) => state.answers);
  const sharedDiscussions = usePazzaStore((state) => state.discussions);
  const sharedReplies = usePazzaStore((state) => state.replies);
  const [screen, setScreen] = useState<Screen>("glance");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newPostFolderIds, setNewPostFolderIds] = useState<string[]>([]);

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
  const folders = sharedFolders.filter((folder) => folder.courseId === cid);
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
  const authorizedPosts = posts.filter((post) =>
    canViewPost(post, pazzaUser, cid),
  );
  const visiblePosts = authorizedPosts.filter(
    (post) =>
      selectedFolderId === null || post.folderIds.includes(selectedFolderId),
  );
  const visiblePostIds = new Set(authorizedPosts.map((post) => post._id));
  // Both the Post Screen and statistics use the same live answers.
  const courseAnswers = sharedAnswers.filter(
    (answer) => answer.courseId === cid && visiblePostIds.has(answer.postId),
  );
  const glanceData: ClassAtAGlanceData = {
    course: pazzaCourse,
    posts: authorizedPosts,
    answers: courseAnswers,
    enrolledStudentCount: courseUsers.filter((user) => user.role === "STUDENT")
      .length,
    currentUser: pazzaUser,
  };
  const selectedPost = authorizedPosts.find(
    (post) => post._id === selectedPostId,
  );
  const editingPost =
    screen === "edit" && selectedPost && canModifyPost(selectedPost, pazzaUser)
      ? selectedPost
      : null;
  const answersProps: AnswersProps | null = selectedPost
    ? {
        post: selectedPost,
        course: pazzaCourse,
        currentUser: pazzaUser,
        answers: courseAnswers.filter(
          (answer) => answer.postId === selectedPost._id,
        ),
      }
    : null;
  const discussionsProps: FollowUpDiscussionsProps | null = selectedPost
    ? {
        post: selectedPost,
        course: pazzaCourse,
        currentUser: pazzaUser,
        discussions: sharedDiscussions.filter(
          (discussion) =>
            discussion.courseId === cid &&
            discussion.postId === selectedPost._id,
        ),
        replies: sharedReplies.filter(
          (reply) =>
            reply.courseId === cid &&
            sharedDiscussions.some(
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
            // Clicking the already-open post does not represent another opening.
            if (screen === "post" && selectedPostId === postId) return;
            if (!openPost(postId, cid, pazzaUser)) return;
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
          {(screen === "new" || editingPost) && (
            <NewPostForm
              key={editingPost?._id ?? `new-${cid}`}
              initialPost={editingPost ?? undefined}
              folders={folders}
              users={courseUsers}
              courseId={cid}
              currentUser={pazzaUser}
              onUpdatePost={(post: PazzaPost) => {
                if (!updatePost(post, pazzaUser)) return;
                setSelectedFolderId(null);
                setSelectedPostId(post._id);
                setScreen("post");
              }}
              onCreatePost={(post: PazzaPost) => {
                addPost(post);
                // The newly published post is immediately opened in PostView.
                openPost(post._id, cid, pazzaUser);
                setSelectedFolderId(null);
                setSelectedPostId(post._id);
                setScreen("post");
              }}
              selectedFolderIds={newPostFolderIds}
              onChange={setNewPostFolderIds}
              onCancel={() => {
                setNewPostFolderIds([]);
                if (editingPost) {
                  setScreen("post");
                } else {
                  showGlance();
                }
              }}
            />
          )}
          {screen === "post" &&
            selectedPost &&
            answersProps &&
            discussionsProps && (
              <PostView
                key={selectedPost._id}
                onEdit={() => {
                  if (!canModifyPost(selectedPost, pazzaUser)) return;
                  setNewPostFolderIds([...selectedPost.folderIds]);
                  setScreen("edit");
                }}
                onDelete={() => {
                  if (!canModifyPost(selectedPost, pazzaUser)) return;
                  if (
                    !window.confirm("Delete this post? This cannot be undone.")
                  )
                    return;
                  if (!deletePost(selectedPost._id, pazzaUser)) return;
                  // Delete only records belonging to this successfully deleted post.
                  usePazzaStore
                    .getState()
                    .removePostData(cid, selectedPost._id);
                  setNewPostFolderIds([]);
                  showGlance();
                }}
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

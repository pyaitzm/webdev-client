"use client";

import { create } from "zustand";
import { mockPazzaPosts } from "../shared/mockData";
import type { PazzaPost, PazzaUser } from "../shared/types";

const isInstructor = (role: PazzaUser["role"]) =>
  role === "FACULTY" || role === "TA" || role === "ADMIN";

/** The same permission check is applied to store actions, not only UI buttons. */
export function canModifyPost(
  post: PazzaPost,
  user: PazzaUser | null,
): boolean {
  return Boolean(
    user && (post.authorId === user._id || isInstructor(user.role)),
  );
}

/** Only course posts addressed to this viewer may be opened. */
export function canViewPost(
  post: PazzaPost,
  user: PazzaUser | null,
  courseId: string,
): boolean {
  return (
    post.courseId === courseId &&
    (post.audience === "ENTIRE_CLASS" ||
      (user !== null &&
        (post.authorId === user._id || post.recipientIds.includes(user._id))))
  );
}

type PostsStore = {
  posts: PazzaPost[];
  addPost: (post: PazzaPost) => void;
  openPost: (
    postId: string,
    courseId: string,
    viewer: PazzaUser | null,
  ) => boolean;
  updatePost: (post: PazzaPost, actor: PazzaUser | null) => boolean;
  deletePost: (postId: string, actor: PazzaUser | null) => boolean;
};

/** Temporary client-side posts. Server-side authorization comes with the API layer. */
export const usePazzaPostsStore = create<PostsStore>((set, get) => ({
  posts: [...mockPazzaPosts],
  addPost: (post) => set((state) => ({ posts: [...state.posts, post] })),
  openPost: (postId, courseId, viewer) => {
    const post = get().posts.find((item) => item._id === postId);
    if (!post || !canViewPost(post, viewer, courseId)) return false;

    // Count an intentional opening once, not each React render. Only
    // authenticated viewers get an entry in the per-user read list.
    set((state) => ({
      posts: state.posts.map((item) =>
        item._id === postId
          ? {
              ...item,
              viewCount: item.viewCount + 1,
              readByUserIds:
                viewer && !item.readByUserIds.includes(viewer._id)
                  ? [...item.readByUserIds, viewer._id]
                  : item.readByUserIds,
            }
          : item,
      ),
    }));
    return true;
  },
  updatePost: (edited, actor) => {
    const original = get().posts.find((post) => post._id === edited._id);
    if (!original || !canModifyPost(original, actor)) return false;
    // Editing cannot change ownership, course, creation time, or activity history.
    set((state) => ({
      posts: state.posts.map((post) =>
        post._id === edited._id
          ? {
              ...post,
              type: edited.type,
              audience: edited.audience,
              recipientIds: [...edited.recipientIds],
              folderIds: [...edited.folderIds],
              summary: edited.summary,
              details: edited.details,
              updatedAt: new Date().toISOString(),
            }
          : post,
      ),
    }));
    return true;
  },
  deletePost: (postId, actor) => {
    const original = get().posts.find((post) => post._id === postId);
    if (!original || !canModifyPost(original, actor)) return false;
    set((state) => ({
      posts: state.posts.filter((post) => post._id !== postId),
    }));
    return true;
  },
}));

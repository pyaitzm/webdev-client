"use client";

import { useState } from "react";
import type {
  AnswersProps,
  FollowUpDiscussionsProps,
} from "./shared/componentContracts";
import type { PazzaFolder, PazzaUser } from "./shared/types";
import AnswersSection from "./member-b/AnswersSection";
import FollowUpDiscussions from "./member-b/FollowUpDiscussions";

type PostViewProps = {
  answersProps: AnswersProps;
  discussionsProps: FollowUpDiscussionsProps;
  folders: PazzaFolder[];
  users: PazzaUser[];
};

function nameOf(user: PazzaUser | undefined): string {
  return user ? `${user.firstName} ${user.lastName}` : "Unknown user";
}

/** Display the text in trusted mock HTML without executing its markup. */
function textFromMockHtml(html: string): string {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])\s*>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export default function PostView({
  answersProps,
  discussionsProps,
  folders,
  users,
}: PostViewProps) {
  const { post, currentUser } = answersProps;
  const [actionsOpen, setActionsOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const author = users.find((user) => user._id === post.authorId);
  const isInstructor =
    currentUser?.role === "FACULTY" ||
    currentUser?.role === "TA" ||
    currentUser?.role === "ADMIN";
  const canModify = Boolean(
    currentUser && (currentUser._id === post.authorId || isInstructor),
  );
  const postFolders = folders.filter((folder) =>
    post.folderIds.includes(folder._id),
  );

  function previewAction(action: "Edit" | "Delete") {
    setActionsOpen(false);
    setNotice(
      `${action} will be implemented during Days 5–7. This sample post has not changed.`,
    );
  }

  return (
    <article aria-label="Selected post" className="min-w-0 space-y-6">
      <header className="border-b border-gray-200 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-sm font-medium text-blue-800">
              {post.type === "QUESTION" ? "Question" : "Note"}
            </p>
            <h2 className="break-words text-xl font-semibold">
              {post.summary}
            </h2>
          </div>
          {canModify && (
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => previewAction("Edit")}
                className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
              >
                Edit
              </button>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={actionsOpen}
                  aria-haspopup="menu"
                  onClick={() => setActionsOpen((open) => !open)}
                  className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                >
                  Actions ▾
                </button>
                {actionsOpen && (
                  <div
                    role="menu"
                    aria-label="Post actions"
                    className="absolute right-0 z-20 mt-1 min-w-32 rounded border border-gray-200 bg-white p-1 shadow-md"
                  >
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => previewAction("Edit")}
                      className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => previewAction("Delete")}
                      className="block w-full rounded px-3 py-2 text-left text-sm text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
          <span>Posted by {nameOf(author)}</span>
          <span>{new Date(post.createdAt).toLocaleString()}</span>
          <span>
            {post.viewCount} {post.viewCount === 1 ? "view" : "views"}
          </span>
        </div>
        <div
          className="mt-3 flex flex-wrap items-center gap-2"
          aria-label="Post folders"
        >
          <span className="text-sm text-gray-600">Folders:</span>
          {postFolders.map((folder) => (
            <span
              key={folder._id}
              className="rounded bg-blue-50 px-2 py-1 text-xs text-blue-900"
            >
              {folder.name}
            </span>
          ))}
          {postFolders.length === 0 && (
            <span className="text-sm text-gray-500">None</span>
          )}
        </div>
      </header>

      <section
        aria-label="Post details"
        className="whitespace-pre-wrap break-words text-sm leading-7 text-gray-800"
      >
        {textFromMockHtml(post.details)}
      </section>
      {notice && (
        <p
          role="status"
          className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
        >
          {notice}
        </p>
      )}

      {post.type === "QUESTION" && (
        <section aria-label="Answers" className="border-t border-gray-200 pt-5">
          <AnswersSection key={post._id} {...answersProps} users={users} />
        </section>
      )}
      <section
        aria-label="Follow-up discussions"
        className="border-t border-gray-200 pt-5"
      >
        <FollowUpDiscussions
          key={post._id}
          {...discussionsProps}
          users={users}
        />
      </section>
    </article>
  );
}

"use client";

import { useState } from "react";
import type { PazzaPost, PazzaUser } from "./shared/types";
import { normalizeSummary } from "./shared/normalizeSummary";

type PostListSidebarProps = {
  posts: PazzaPost[];
  users: PazzaUser[];
  selectedPostId: string | null;
  onSelectPost: (postId: string) => void;
  onNewPost: () => void;
};

function mondayOf(date: Date): Date {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  day.setDate(day.getDate() - ((day.getDay() + 6) % 7));
  return day;
}

function groupLabel(createdAt: string, now: Date): string {
  const date = new Date(createdAt);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const posted = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysAgo = Math.round((today.getTime() - posted.getTime()) / 86400000);
  if (daysAgo === 0) return "Today";
  if (daysAgo === 1) return "Yesterday";

  const weekStart = mondayOf(date);
  const currentWeekStart = mondayOf(now);
  const priorWeekStart = new Date(currentWeekStart);
  priorWeekStart.setDate(priorWeekStart.getDate() - 7);
  if (weekStart.getTime() === priorWeekStart.getTime()) return "Last Week";

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;
  return `${fmt(weekStart)} - ${fmt(weekEnd)}`;
}

function plainText(html: string): string {
  // Show readable text without carrying HTML tags or encoded spaces.
  return normalizeSummary(html.replace(/<[^>]*>/g, " "));
}

export default function PostListSidebar({
  posts,
  users,
  selectedPostId,
  onSelectPost,
  onNewPost,
}: PostListSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [query, setQuery] = useState("");
  const [closedGroups, setClosedGroups] = useState<string[]>([]);
  const now = new Date();
  const sorted = [...posts]
    .filter((post) =>
      `${normalizeSummary(post.summary)} ${plainText(post.details)}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  const groups = new Map<string, PazzaPost[]>();
  for (const post of sorted) {
    const label = groupLabel(post.createdAt, now);
    const group = groups.get(label) ?? [];
    group.push(post);
    groups.set(label, group);
  }

  return (
    <aside
      aria-label="List of posts"
      className={`${collapsed ? "md:w-14" : "md:w-72"} w-full shrink-0 border-b border-gray-200 md:border-r md:border-b-0`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 p-3">
        {!collapsed && <h2 className="font-semibold">Posts</h2>}
        <button
          type="button"
          aria-label={collapsed ? "Expand post list" : "Collapse post list"}
          aria-expanded={!collapsed}
          onClick={() => setCollapsed((value) => !value)}
          className="rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-100"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>
      {!collapsed && (
        <div className="p-3">
          <button
            type="button"
            onClick={onNewPost}
            className="mb-3 w-full rounded bg-blue-800 px-3 py-2 text-sm font-medium text-white hover:bg-blue-900"
          >
            New Post
          </button>
          <label
            htmlFor="pazza-post-search"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Search posts
          </label>
          <input
            id="pazza-post-search"
            type="search"
            placeholder="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="mb-3 w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
          {sorted.length === 0 && (
            <p className="text-sm text-gray-500">No posts found.</p>
          )}
          {Array.from(groups, ([label, entries]) => (
            <section key={label} className="mb-3">
              <button
                type="button"
                aria-expanded={!closedGroups.includes(label)}
                onClick={() =>
                  setClosedGroups((previous) =>
                    previous.includes(label)
                      ? previous.filter((name) => name !== label)
                      : [...previous, label],
                  )
                }
                className="flex w-full items-center justify-between border-b border-gray-200 py-2 text-left text-sm font-semibold text-gray-700"
              >
                <span>
                  {label} ({entries.length})
                </span>
                <span aria-hidden="true">
                  {closedGroups.includes(label) ? "+" : "−"}
                </span>
              </button>
              {!closedGroups.includes(label) &&
                entries.map((post) => {
                  const author = users.find(
                    (user) => user._id === post.authorId,
                  );
                  const authorRole =
                    author?.role === "FACULTY" || author?.role === "ADMIN"
                      ? "Instructor"
                      : "Student";
                  const preview = plainText(post.details);
                  return (
                    <button
                      type="button"
                      key={post._id}
                      onClick={() => onSelectPost(post._id)}
                      aria-current={
                        selectedPostId === post._id ? "true" : undefined
                      }
                      className={`my-1 block w-full rounded border p-3 text-left text-sm hover:bg-blue-50 ${selectedPostId === post._id ? "border-blue-700 bg-blue-50" : "border-gray-200"}`}
                    >
                      <span className="block font-bold">
                        {normalizeSummary(post.summary)}
                      </span>
                      <span className="mt-1 block text-xs text-gray-600">
                        {authorRole} ·{" "}
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                      <span className="mt-1 line-clamp-4 block whitespace-normal break-words text-gray-700">
                        {preview}
                      </span>
                    </button>
                  );
                })}
            </section>
          ))}
        </div>
      )}
    </aside>
  );
}

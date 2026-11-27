"use client";

import { useEffect, useState } from "react";
import type {
  AnswersProps,
  FollowUpDiscussionsProps,
} from "./shared/componentContracts";
import type { PazzaFolder, PazzaUser } from "./shared/types";
import { normalizeSummary } from "./shared/normalizeSummary";
import AnswersSection from "./member-b/AnswersSection";
import FollowUpDiscussions from "./member-b/FollowUpDiscussions";

type PostViewProps = {
  answersProps: AnswersProps;
  discussionsProps: FollowUpDiscussionsProps;
  folders: PazzaFolder[];
  users: PazzaUser[];
  onEdit: () => void;
  onDelete: () => void;
};

function nameOf(user: PazzaUser | undefined): string {
  return user ? `${user.firstName} ${user.lastName}` : "Unknown user";
}

/**
 * Sanitize editor HTML and convert Quill 2 list markup into semantic lists.
 * Only allow a small set of presentation tags and safe link protocols.
 */
function sanitizePostDetails(html: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  const allowedTags = new Set([
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "h1",
    "h2",
    "li",
    "a",
    "blockquote",
    "span",
  ]);
  const discardedTags = new Set([
    "script",
    "style",
    "iframe",
    "object",
    "embed",
    "svg",
    "math",
    "form",
    "input",
    "button",
    "template",
    "noscript",
  ]);

  function clean(node: Node): Node | null {
    if (node.nodeType === Node.TEXT_NODE) {
      return document.createTextNode(node.textContent ?? "");
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    if (discardedTags.has(tag)) return null;

    if (tag === "ol" || tag === "ul") {
      return cleanList(element, tag);
    }

    // Quill's list UI span is decorative; semantic lists provide the markers.
    if (tag === "span" && element.classList.contains("ql-ui")) return null;

    const result = document.createElement(allowedTags.has(tag) ? tag : "span");
    if (tag === "a") {
      const href = (element.getAttribute("href") ?? "").trim();
      if (/^(https?:\/\/|mailto:)/i.test(href)) {
        result.setAttribute("href", href);
        result.setAttribute("rel", "noopener noreferrer");
        result.setAttribute("target", "_blank");
        result.setAttribute("style", "color:#1d4ed8;text-decoration:underline");
      }
    }
    if (tag === "h1")
      result.setAttribute("style", "font-size:1.5rem;font-weight:700");
    if (tag === "h2")
      result.setAttribute("style", "font-size:1.25rem;font-weight:700");
    if (tag === "blockquote") {
      result.setAttribute(
        "style",
        "border-left:3px solid #d1d5db;padding-left:1rem",
      );
    }

    for (const child of Array.from(element.childNodes)) {
      const cleaned = clean(child);
      if (cleaned) result.appendChild(cleaned);
    }
    return result;
  }

  function makeList(kind: "ol" | "ul"): HTMLOListElement | HTMLUListElement {
    const list = document.createElement(kind);
    list.setAttribute(
      "style",
      `list-style-type:${kind === "ul" ? "disc" : "decimal"};padding-left:1.5rem`,
    );
    return list;
  }

  function cleanList(
    element: Element,
    outerKind: "ol" | "ul",
  ): DocumentFragment {
    const fragment = document.createDocumentFragment();
    // The stack tracks actual nesting, rather than visual margins on flat items.
    const stack: Array<{
      kind: "ol" | "ul";
      list: HTMLOListElement | HTMLUListElement;
      lastItem: HTMLLIElement | null;
    }> = [];

    for (const item of Array.from(element.children)) {
      if (item.tagName.toLowerCase() !== "li") continue;
      const dataList = item.getAttribute("data-list");
      const kind: "ol" | "ul" =
        dataList === "bullet"
          ? "ul"
          : dataList === "ordered"
            ? "ol"
            : outerKind;
      const indentMatch = Array.from(item.classList)
        .map((name) => /^ql-indent-([1-8])$/.exec(name))
        .find((match) => match !== null);
      const requestedDepth = indentMatch ? Number(indentMatch[1]) : 0;
      // A nested level needs a parent item. Clamp malformed input safely.
      const depth = Math.min(requestedDepth, stack.length);

      while (stack.length > depth + 1) stack.pop();
      if (stack.length === depth + 1 && stack[depth].kind !== kind) stack.pop();

      if (stack.length <= depth) {
        const list = makeList(kind);
        if (depth === 0) {
          fragment.appendChild(list);
        } else {
          stack[depth - 1].lastItem?.appendChild(list);
        }
        stack.push({ kind, list, lastItem: null });
      }

      const cleanedItem = document.createElement("li");
      for (const child of Array.from(item.childNodes)) {
        const cleaned = clean(child);
        if (cleaned) cleanedItem.appendChild(cleaned);
      }
      stack[depth].list.appendChild(cleanedItem);
      stack[depth].lastItem = cleanedItem;
    }
    return fragment;
  }

  const container = document.createElement("div");
  for (const node of Array.from(document.body.childNodes)) {
    const cleaned = clean(node);
    if (cleaned) container.appendChild(cleaned);
  }
  return container.innerHTML;
}

export default function PostView({
  answersProps,
  discussionsProps,
  folders,
  users,
  onEdit,
  onDelete,
}: PostViewProps) {
  const { post, currentUser } = answersProps;
  const [actionsOpen, setActionsOpen] = useState(false);
  const [formattedDetails, setFormattedDetails] = useState({
    source: "",
    html: "",
  });

  useEffect(() => {
    setFormattedDetails({
      source: post.details,
      html: sanitizePostDetails(post.details),
    });
  }, [post.details]);

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

  function handleAction(action: "Edit" | "Delete") {
    setActionsOpen(false);
    if (action === "Edit") onEdit();
    else onDelete();
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
              {normalizeSummary(post.summary)}
            </h2>
          </div>
          {canModify && (
            <div className="flex items-start gap-2">
              <button
                type="button"
                onClick={() => handleAction("Edit")}
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
                      onClick={() => handleAction("Edit")}
                      className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleAction("Delete")}
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
        className="break-words text-sm text-gray-800"
      >
        {formattedDetails.source === post.details ? (
          <div
            className="space-y-2"
            dangerouslySetInnerHTML={{ __html: formattedDetails.html }}
          />
        ) : (
          <p className="whitespace-pre-wrap">
            {normalizeSummary(post.details.replace(/<[^>]*>/g, " "))}
          </p>
        )}
      </section>
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

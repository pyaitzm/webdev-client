"use client";

import { useState, type FormEvent } from "react";
import type { FolderSelectionProps } from "./shared/componentContracts";
import type {
  PazzaPost,
  PazzaUser,
  PostAudience,
  PostType,
} from "./shared/types";
import RichTextEditor from "./RichTextEditor";
import { normalizeSummary } from "./shared/normalizeSummary";

type NewPostFormProps = FolderSelectionProps & {
  users: PazzaUser[];
  courseId: string;
  currentUser: PazzaUser | null;
  onCreatePost: (post: PazzaPost) => void;
  initialPost?: PazzaPost;
  onUpdatePost?: (post: PazzaPost) => void;
  onCancel: () => void;
};

const inputClass =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm";

export default function NewPostForm({
  folders,
  selectedFolderIds,
  onChange,
  users,
  courseId,
  currentUser,
  onCreatePost,
  initialPost,
  onUpdatePost,
  onCancel,
}: NewPostFormProps) {
  const [type, setType] = useState<PostType>(initialPost?.type ?? "QUESTION");
  const [audience, setAudience] = useState<PostAudience>(
    initialPost?.audience ?? "ENTIRE_CLASS",
  );
  const [recipientIds, setRecipientIds] = useState<string[]>(
    initialPost?.recipientIds ?? [],
  );
  const [summary, setSummary] = useState(initialPost?.summary ?? "");
  const [details, setDetails] = useState(initialPost?.details ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const instructors = users.filter(
    (user) =>
      user.role === "FACULTY" || user.role === "TA" || user.role === "ADMIN",
  );
  const otherUsers = users.filter(
    (user) =>
      user.role !== "FACULTY" && user.role !== "TA" && user.role !== "ADMIN",
  );
  const allInstructorsSelected =
    instructors.length > 0 &&
    instructors.every((instructor) => recipientIds.includes(instructor._id));

  const toggleRecipient = (id: string) => {
    setRecipientIds((selected) =>
      selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id],
    );
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Quill can represent an empty editor as HTML such as <p><br></p>.
    const readableDetails = normalizeSummary(details.replace(/<[^>]*>/g, " "));
    const cleanSummary = normalizeSummary(summary);
    const nextErrors: string[] = [];
    if (!currentUser) nextErrors.push("Sign in to create a post.");
    if (selectedFolderIds.length === 0)
      nextErrors.push("Select at least one folder.");
    if (!cleanSummary) nextErrors.push("Enter a summary.");
    if (cleanSummary.length > 100)
      nextErrors.push("The summary must be 100 characters or fewer.");
    if (!readableDetails) nextErrors.push("Enter post details.");
    if (audience === "SELECTED_USERS" && recipientIds.length === 0)
      nextErrors.push("Select at least one recipient.");

    setErrors(nextErrors);
    if (nextErrors.length > 0 || !currentUser) return;

    if (initialPost) {
      onUpdatePost?.({
        ...initialPost,
        type,
        audience,
        recipientIds: audience === "ENTIRE_CLASS" ? [] : [...recipientIds],
        folderIds: [...selectedFolderIds],
        summary: cleanSummary,
        details,
      });
      return;
    }

    const timestamp = new Date().toISOString();
    onCreatePost({
      _id: crypto.randomUUID(),
      courseId,
      authorId: currentUser._id,
      type,
      audience,
      recipientIds: audience === "ENTIRE_CLASS" ? [] : recipientIds,
      folderIds: [...selectedFolderIds],
      summary: cleanSummary,
      details,
      createdAt: timestamp,
      updatedAt: timestamp,
      viewCount: 0,
      readByUserIds: [currentUser._id],
    });
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold">
          {initialPost ? "Edit Post" : "New Post"}
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          {initialPost
            ? "Update your question or note."
            : "Compose a question or note for your course."}
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 font-semibold">Post Type</legend>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="post-type"
              checked={type === "QUESTION"}
              onChange={() => {
                setType("QUESTION");
                setErrors([]);
              }}
            />
            Question
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="post-type"
              checked={type === "NOTE"}
              onChange={() => {
                setType("NOTE");
                setErrors([]);
              }}
            />
            Note
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">Post To</legend>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="post-to"
              checked={audience === "ENTIRE_CLASS"}
              onChange={() => {
                setAudience("ENTIRE_CLASS");
                setErrors([]);
              }}
            />
            Entire Class
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="post-to"
              checked={audience === "SELECTED_USERS"}
              onChange={() => {
                setAudience("SELECTED_USERS");
                setErrors([]);
              }}
            />
            Individual Students/Instructors
          </label>
        </div>
        {audience === "SELECTED_USERS" && (
          <div className="mt-3 rounded border border-gray-200 bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium">Select recipients</p>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={allInstructorsSelected}
                  disabled={instructors.length === 0}
                  onChange={(event) => {
                    const ids = instructors.map((user) => user._id);
                    setRecipientIds((previous) =>
                      event.target.checked
                        ? [...new Set([...previous, ...ids])]
                        : previous.filter((id) => !ids.includes(id)),
                    );
                  }}
                />
                Instructors
              </label>
              {[...instructors, ...otherUsers].map((user) => (
                <label
                  key={user._id}
                  className="flex items-center gap-2 text-sm"
                >
                  <input
                    type="checkbox"
                    checked={recipientIds.includes(user._id)}
                    onChange={() => toggleRecipient(user._id)}
                  />
                  {user.firstName} {user.lastName} ({user.role})
                </label>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-semibold">Select Folders</legend>
        <div className="grid grid-cols-2 gap-2 rounded border border-gray-200 p-3 sm:grid-cols-3">
          {folders.map((folder) => (
            <label key={folder._id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedFolderIds.includes(folder._id)}
                onChange={(event) =>
                  onChange(
                    event.target.checked
                      ? [...selectedFolderIds, folder._id]
                      : selectedFolderIds.filter((id) => id !== folder._id),
                  )
                }
              />
              {folder.name}
            </label>
          ))}
        </div>
        <p className="mt-1 text-xs text-gray-600">
          Select at least one folder when publishing.
        </p>
      </fieldset>

      <div>
        <label
          htmlFor="pazza-post-summary"
          className="mb-2 block font-semibold"
        >
          Summary
        </label>
        <input
          id="pazza-post-summary"
          className={inputClass}
          type="text"
          placeholder="Enter a summary (100 characters maximum)"
          maxLength={100}
          value={summary}
          onChange={(event) => {
            setSummary(event.target.value);
            setErrors([]);
          }}
        />
        <p className="mt-1 text-right text-xs text-gray-600">
          {summary.length}/100
        </p>
      </div>

      <div>
        <label
          id="pazza-post-details-label"
          className="mb-2 block font-semibold"
        >
          Details
        </label>
        <RichTextEditor
          value={details}
          onChange={(value) => {
            setDetails(value);
            setErrors([]);
          }}
        />
      </div>

      {errors.length > 0 && (
        <div
          role="alert"
          className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        >
          <p className="font-semibold">Please correct the following:</p>
          <ul className="mt-1 list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
        >
          {initialPost
            ? "Save Changes"
            : `Post ${type === "QUESTION" ? "Question" : "Note"}`}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

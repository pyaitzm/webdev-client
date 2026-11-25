"use client";

import { useState, type FormEvent } from "react";
import type { FolderSelectionProps } from "./shared/componentContracts";
import type { PazzaUser, PostAudience, PostType } from "./shared/types";
import RichTextEditor from "./RichTextEditor";

type NewPostFormProps = FolderSelectionProps & {
  users: PazzaUser[];
  onCancel: () => void;
};

const inputClass =
  "w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm";

export default function NewPostForm({
  folders,
  selectedFolderIds,
  onChange,
  users,
  onCancel,
}: NewPostFormProps) {
  const [type, setType] = useState<PostType>("QUESTION");
  const [audience, setAudience] = useState<PostAudience>("ENTIRE_CLASS");
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState("");
  const [notice, setNotice] = useState(false);

  const instructors = users.filter(
    (user) => user.role === "FACULTY" || user.role === "ADMIN",
  );
  const otherUsers = users.filter(
    (user) => user.role !== "FACULTY" && user.role !== "ADMIN",
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
    // Stage 3 intentionally does not create posts or change the shared fixtures.
    setNotice(true);
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-5">
      <div>
        <h2 className="text-xl font-semibold">New Post</h2>
        <p className="mt-1 text-sm text-gray-600">
          Compose a question or note for your course.
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
                setNotice(false);
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
                setNotice(false);
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
                setNotice(false);
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
                setNotice(false);
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
            setNotice(false);
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
            setNotice(false);
          }}
        />
      </div>

      {notice && (
        <p
          role="status"
          className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
        >
          This is the Stage 3 interface preview. Publishing and validation will
          be implemented during Days 5–7; no post has been saved.
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-blue-900"
        >
          Post {type === "QUESTION" ? "Question" : "Note"}
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

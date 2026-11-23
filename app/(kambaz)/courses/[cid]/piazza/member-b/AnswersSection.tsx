"use client";

import { useMemo, useState } from "react";
import type { AnswersProps } from "../shared/componentContracts";
import type { AnswerKind, PazzaAnswer, PazzaUser } from "../shared/types";

const displayName = (userId: string, users: PazzaUser[]) => {
  const user = users.find((candidate) => candidate._id === userId);
  return user ? `${user.firstName} ${user.lastName}` : "Unknown user";
};

const isInstructor = (user: PazzaUser | null) =>
  user?.role === "FACULTY" || user?.role === "TA" || user?.role === "ADMIN";

type Props = AnswersProps & { users?: PazzaUser[] };

/** UI-only Day 2–4 answer section. API persistence is added in the next project phase. */
export default function AnswersSection({
  post,
  course,
  currentUser,
  answers,
  users = [],
  onAnswersChanged,
}: Props) {
  const [items, setItems] = useState(answers);
  const [draft, setDraft] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const grouped = useMemo(
    () => ({
      instructor: items.filter((answer) => answer.kind === "INSTRUCTOR"),
      student: items.filter((answer) => answer.kind === "STUDENT"),
    }),
    [items],
  );

  const canSubmit = Boolean(currentUser && post.type === "QUESTION");
  const saveItems = (next: PazzaAnswer[]) => {
    setItems(next);
    onAnswersChanged?.();
  };

  const addAnswer = () => {
    const content = draft.trim();
    if (!content || !currentUser) return;
    const now = new Date().toISOString();
    saveItems([
      ...items,
      {
        _id: `answer-${crypto.randomUUID()}`,
        courseId: course._id,
        postId: post._id,
        authorId: currentUser._id,
        kind: isInstructor(currentUser) ? "INSTRUCTOR" : "STUDENT",
        content,
        createdAt: now,
        updatedAt: now,
      },
    ]);
    setDraft("");
  };

  const canManage = (answer: PazzaAnswer) =>
    currentUser && (answer.authorId === currentUser._id || isInstructor(currentUser));

  const renderGroup = (title: string, kind: AnswerKind, group: PazzaAnswer[]) => (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-lg font-semibold text-slate-800">{title}</h3>
      {group.length === 0 ? (
        <p className="text-sm text-slate-500">No {kind.toLowerCase()} answers yet.</p>
      ) : (
        <ul className="space-y-3">
          {group.map((answer) => (
            <li key={answer._id} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-slate-800">{displayName(answer.authorId, users)}</span>
                <time className="text-slate-500">{new Date(answer.createdAt).toLocaleString()}</time>
              </div>
              {editingId === answer._id ? (
                <div className="mt-2 space-y-2">
                  <textarea aria-label="Edit answer" className="w-full rounded border border-slate-300 p-2" value={editingContent} onChange={(event) => setEditingContent(event.target.value)} />
                  <button type="button" className="rounded bg-red-700 px-3 py-1 text-sm font-medium text-white" onClick={() => {
                    const content = editingContent.trim();
                    if (!content) return;
                    saveItems(items.map((item) => item._id === answer._id ? { ...item, content, updatedAt: new Date().toISOString() } : item));
                    setEditingId(null);
                  }}>Save</button>
                  <button type="button" className="ms-2 text-sm text-slate-600 underline" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <p className="mt-1 whitespace-pre-wrap text-slate-700">{answer.content}</p>
              )}
              {canManage(answer) && editingId !== answer._id ? (
                <div className="mt-2 flex gap-3 text-sm">
                  <button type="button" className="text-red-700 underline" onClick={() => { setEditingId(answer._id); setEditingContent(answer.content); }}>Edit</button>
                  <button type="button" className="text-red-700 underline" onClick={() => saveItems(items.filter((item) => item._id !== answer._id))}>Delete</button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  return (
    <div id="wd-pazza-answers" className="space-y-4">
      {renderGroup("Instructor Answers", "INSTRUCTOR", grouped.instructor)}
      {renderGroup("Student Answers", "STUDENT", grouped.student)}
      {canSubmit ? (
        <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="font-semibold text-slate-800">Submit an answer</h3>
          <textarea aria-label="Answer content" className="mt-2 min-h-24 w-full rounded border border-slate-300 p-2" placeholder="Write an answer…" value={draft} onChange={(event) => setDraft(event.target.value)} />
          <button type="button" className="mt-2 rounded bg-red-700 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-400" disabled={!draft.trim()} onClick={addAnswer}>Post Answer</button>
        </section>
      ) : (
        <p className="rounded bg-slate-100 p-3 text-sm text-slate-600">Sign in and open a question post to submit an answer.</p>
      )}
    </div>
  );
}

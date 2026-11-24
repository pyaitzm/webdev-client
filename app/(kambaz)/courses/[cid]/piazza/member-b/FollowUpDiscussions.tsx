"use client";

import { useEffect, useState } from "react";
import type { FollowUpDiscussionsProps } from "../shared/componentContracts";
import type { PazzaDiscussion, PazzaReply, PazzaUser } from "../shared/types";

const nameFor = (id: string, users: PazzaUser[]) => {
  const user = users.find((candidate) => candidate._id === id);
  return user ? `${user.firstName} ${user.lastName}` : "Unknown user";
};
const canModerate = (user: PazzaUser | null) => Boolean(user && ["FACULTY", "TA", "ADMIN"].includes(user.role));

type Props = FollowUpDiscussionsProps & { users?: PazzaUser[] };

/** UI-only recursive discussion/reply surface for integration into A's PostView. */
export default function FollowUpDiscussions({ course, post, currentUser, discussions, replies, users = [], onDiscussionsChanged }: Props) {
  const [discussionItems, setDiscussionItems] = useState(discussions);
  const [replyItems, setReplyItems] = useState(replies);
  const [newDiscussion, setNewDiscussion] = useState("");
  const [replyTarget, setReplyTarget] = useState<{ discussionId: string; parentReplyId: string | null } | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [editingDiscussionId, setEditingDiscussionId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState("");

  // A's PostView can switch posts while keeping this child mounted.
  useEffect(() => {
    setDiscussionItems(discussions);
    setReplyItems(replies);
    setReplyTarget(null);
    setEditingDiscussionId(null);
    setEditingReplyId(null);
  }, [post._id, discussions, replies]);

  // Do not leave a reply composer visible after a user signs out.
  useEffect(() => {
    if (!currentUser) setReplyTarget(null);
  }, [currentUser]);

  const changed = () => onDiscussionsChanged?.();
  const allowed = (authorId: string) => Boolean(currentUser && (authorId === currentUser._id || canModerate(currentUser)));
  const addDiscussion = () => {
    if (!currentUser || !newDiscussion.trim()) return;
    const now = new Date().toISOString();
    setDiscussionItems([...discussionItems, { _id: `discussion-${crypto.randomUUID()}`, courseId: course._id, postId: post._id, authorId: currentUser._id, content: newDiscussion.trim(), resolved: false, createdAt: now, updatedAt: now }]);
    setNewDiscussion(""); changed();
  };
  const addReply = () => {
    if (!currentUser || !replyTarget || !replyDraft.trim()) return;
    const now = new Date().toISOString();
    setReplyItems([...replyItems, { _id: `reply-${crypto.randomUUID()}`, courseId: course._id, discussionId: replyTarget.discussionId, parentReplyId: replyTarget.parentReplyId, authorId: currentUser._id, content: replyDraft.trim(), createdAt: now, updatedAt: now }]);
    setReplyDraft(""); setReplyTarget(null); changed();
  };
  const repliesFor = (discussionId: string, parentReplyId: string | null) => replyItems.filter((reply) => reply.discussionId === discussionId && reply.parentReplyId === parentReplyId);
  const descendantReplyIds = (rootId: string): Set<string> => {
    const deleted = new Set([rootId]);
    let found = true;
    while (found) {
      found = false;
      replyItems.forEach((reply) => {
        if (reply.parentReplyId && deleted.has(reply.parentReplyId) && !deleted.has(reply._id)) {
          deleted.add(reply._id);
          found = true;
        }
      });
    }
    return deleted;
  };
  const renderReplies = (discussionId: string, parentReplyId: string | null, depth = 0) => repliesFor(discussionId, parentReplyId).map((reply) => (
    <div key={reply._id} className="mt-3 border-l-2 border-red-200 ps-3" style={{ marginLeft: Math.min(depth, 3) * 14 }}>
      <p className="text-sm text-slate-700"><span className="font-medium">{nameFor(reply.authorId, users)}</span> · {new Date(reply.createdAt).toLocaleString()}</p>
      {editingReplyId === reply._id ? <div className="mt-2"><textarea aria-label="Edit reply" className="min-h-20 w-full rounded border border-slate-300 p-2" value={editingDraft} onChange={(event) => setEditingDraft(event.target.value)} /><button type="button" className="mt-2 rounded bg-red-700 px-3 py-1 text-sm text-white" onClick={() => { const content = editingDraft.trim(); if (!content) return; setReplyItems(replyItems.map((item) => item._id === reply._id ? { ...item, content, updatedAt: new Date().toISOString() } : item)); setEditingReplyId(null); changed(); }}>Save</button><button type="button" className="ms-3 text-sm underline" onClick={() => setEditingReplyId(null)}>Cancel</button></div> : <p className="mt-1 whitespace-pre-wrap text-slate-700">{reply.content}</p>}
      {currentUser ? <button type="button" className="mt-1 text-sm text-red-700 underline" onClick={() => setReplyTarget({ discussionId, parentReplyId: reply._id })}>Reply</button> : null}
      {allowed(reply.authorId) && editingReplyId !== reply._id ? <><button type="button" className="ms-3 mt-1 text-sm text-red-700 underline" onClick={() => { setEditingReplyId(reply._id); setEditingDraft(reply.content); }}>Edit</button><button type="button" className="ms-3 mt-1 text-sm text-red-700 underline" onClick={() => { const deleted = descendantReplyIds(reply._id); setReplyItems(replyItems.filter((item) => !deleted.has(item._id))); changed(); }}>Delete</button></> : null}
      {renderReplies(discussionId, reply._id, depth + 1)}
    </div>
  ));

  return <section id="wd-pazza-follow-ups" className="rounded border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">Follow-up Discussions</h3><span className="text-sm text-slate-500">{discussionItems.length} discussion{discussionItems.length === 1 ? "" : "s"}</span></div>
    <div className="mt-4 space-y-4">{discussionItems.length === 0 ? <p className="text-sm text-slate-500">No follow-up discussions yet.</p> : discussionItems.map((discussion) => <article key={discussion._id} className="rounded border border-slate-200 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2"><p className="text-sm"><span className="font-medium">{nameFor(discussion.authorId, users)}</span> · {new Date(discussion.createdAt).toLocaleString()}</p><span className={`rounded px-2 py-1 text-xs font-semibold ${discussion.resolved ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{discussion.resolved ? "Resolved" : "Unresolved"}</span></div>
      {editingDiscussionId === discussion._id ? <div className="mt-2"><textarea aria-label="Edit follow-up discussion" className="min-h-20 w-full rounded border border-slate-300 p-2" value={editingDraft} onChange={(event) => setEditingDraft(event.target.value)} /><button type="button" className="mt-2 rounded bg-red-700 px-3 py-1 text-sm text-white" onClick={() => { const content = editingDraft.trim(); if (!content) return; setDiscussionItems(discussionItems.map((item) => item._id === discussion._id ? { ...item, content, updatedAt: new Date().toISOString() } : item)); setEditingDiscussionId(null); changed(); }}>Save</button><button type="button" className="ms-3 text-sm underline" onClick={() => setEditingDiscussionId(null)}>Cancel</button></div> : <p className="mt-2 whitespace-pre-wrap text-slate-700">{discussion.content}</p>}
      <div className="mt-2 flex flex-wrap gap-3 text-sm text-red-700">{currentUser ? <button type="button" className="underline" onClick={() => setReplyTarget({ discussionId: discussion._id, parentReplyId: null })}>Reply</button> : null}{allowed(discussion.authorId) && editingDiscussionId !== discussion._id ? <><button type="button" className="underline" onClick={() => { setEditingDiscussionId(discussion._id); setEditingDraft(discussion.content); }}>Edit</button><button type="button" className="underline" onClick={() => { setDiscussionItems(discussionItems.map((item) => item._id === discussion._id ? { ...item, resolved: !item.resolved, updatedAt: new Date().toISOString() } : item)); changed(); }}>{discussion.resolved ? "Mark unresolved" : "Mark resolved"}</button><button type="button" className="underline" onClick={() => { setDiscussionItems(discussionItems.filter((item) => item._id !== discussion._id)); setReplyItems(replyItems.filter((item) => item.discussionId !== discussion._id)); changed(); }}>Delete</button></> : null}</div>
      {renderReplies(discussion._id, null)}
    </article>)}</div>
    {currentUser ? <div className="mt-4 border-t pt-4"><label className="block text-sm font-medium" htmlFor="wd-new-discussion">Start a follow-up discussion</label><textarea id="wd-new-discussion" className="mt-1 min-h-20 w-full rounded border border-slate-300 p-2" value={newDiscussion} onChange={(event) => setNewDiscussion(event.target.value)} /><button type="button" className="mt-2 rounded bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:bg-slate-400" disabled={!newDiscussion.trim()} onClick={addDiscussion}>Add Discussion</button></div> : null}
    {replyTarget && currentUser ? <div className="mt-4 rounded bg-slate-50 p-3"><label className="block text-sm font-medium" htmlFor="wd-new-reply">Reply</label><textarea id="wd-new-reply" className="mt-1 min-h-20 w-full rounded border border-slate-300 p-2" value={replyDraft} onChange={(event) => setReplyDraft(event.target.value)} /><button type="button" className="mt-2 rounded bg-red-700 px-3 py-1 text-sm text-white" onClick={addReply}>Post Reply</button><button type="button" className="ms-3 text-sm underline" onClick={() => setReplyTarget(null)}>Cancel</button></div> : null}
  </section>;
}

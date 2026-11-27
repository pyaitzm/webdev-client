import { create } from "zustand";
import courses from "../../../../database/courses.json";
import {
  defaultFolderNames, mockPazzaAnswers, mockPazzaDiscussions, mockPazzaFolders, mockPazzaReplies,
} from "../shared/mockData";
import type { PazzaAnswer, PazzaDiscussion, PazzaFolder, PazzaReply } from "../shared/types";

type Store = {
  answers: PazzaAnswer[];
  discussions: PazzaDiscussion[];
  replies: PazzaReply[];
  folders: PazzaFolder[];
  setAnswers: (courseId: string, postId: string, items: PazzaAnswer[]) => void;
  setDiscussions: (courseId: string, postId: string, items: PazzaDiscussion[]) => void;
  setReplies: (courseId: string, postId: string, items: PazzaReply[]) => void;
  deleteReply: (courseId: string, discussionId: string, replyId: string) => void;
  setFolders: (courseId: string, items: PazzaFolder[]) => void;
  removePostData: (courseId: string, postId: string) => void;
};

const initialFolders = courses.flatMap(course => {
  const seeded = mockPazzaFolders.filter(folder => folder.courseId === course._id);
  return seeded.length ? seeded : defaultFolderNames.map((name, index) => ({
    _id: `fixture-${course._id}-folder-${index + 1}`, courseId: course._id, name,
  }));
});

function onPost(item: PazzaAnswer | PazzaDiscussion, courseId: string, postId: string) {
  return item.courseId === courseId && item.postId === postId;
}

export const usePazzaStore = create<Store>((set) => ({
  answers: mockPazzaAnswers,
  discussions: mockPazzaDiscussions,
  replies: mockPazzaReplies,
  folders: initialFolders,
  setAnswers: (courseId, postId, items) => set(state => ({
    answers: [...state.answers.filter(a => !onPost(a, courseId, postId)), ...items],
  })),
  setDiscussions: (courseId, postId, items) => set(state => {
    const kept = new Set(items.map(d => d._id));
    const removed = new Set(state.discussions
      .filter(d => onPost(d, courseId, postId) && !kept.has(d._id)).map(d => d._id));
    return {
      discussions: [...state.discussions.filter(d => !onPost(d, courseId, postId)), ...items],
      replies: state.replies.filter(r => r.courseId !== courseId || !removed.has(r.discussionId)),
    };
  }),
  setReplies: (courseId, postId, items) => set(state => {
    const ids = new Set(state.discussions.filter(d => onPost(d, courseId, postId)).map(d => d._id));
    return { replies: [...state.replies.filter(r => r.courseId !== courseId || !ids.has(r.discussionId)), ...items] };
  }),
  deleteReply: (courseId, discussionId, replyId) => set(state => {
    const thread = state.replies.filter(r => r.courseId === courseId && r.discussionId === discussionId);
    const descendants = new Set<string>();
    const pending = [replyId];
    while (pending.length) {
      const id = pending.pop()!;
      if (descendants.has(id)) continue;
      descendants.add(id);
      for (const reply of thread) {
        if (reply.parentReplyId === id) pending.push(reply._id);
      }
    }
    return { replies: state.replies.filter(reply =>
      reply.courseId !== courseId || reply.discussionId !== discussionId || !descendants.has(reply._id)) };
  }),
  setFolders: (courseId, items) => set(state => ({
    folders: [...state.folders.filter(f => f.courseId !== courseId), ...items],
  })),
  removePostData: (courseId, postId) => set(state => {
    const ids = new Set(state.discussions.filter(d => onPost(d, courseId, postId)).map(d => d._id));
    return {
      answers: state.answers.filter(a => !onPost(a, courseId, postId)),
      discussions: state.discussions.filter(d => !onPost(d, courseId, postId)),
      replies: state.replies.filter(r => r.courseId !== courseId || !ids.has(r.discussionId)),
    };
  }),
}));

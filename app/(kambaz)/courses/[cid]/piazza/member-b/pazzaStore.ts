import { create } from "zustand";
import { defaultFolderNames, mockPazzaAnswers, mockPazzaDiscussions, mockPazzaReplies, mockPazzaFolders } from "../shared/mockData";
import type { PazzaAnswer, PazzaDiscussion, PazzaReply, PazzaFolder } from "../shared/types";
import courses from "../../../../database/courses.json";

type Store = {
  answers: PazzaAnswer[]; discussions: PazzaDiscussion[]; replies: PazzaReply[]; folders: PazzaFolder[];
  setAnswers: (courseId: string, postId: string, items: PazzaAnswer[]) => void;
  setDiscussions: (courseId: string, postId: string, items: PazzaDiscussion[]) => void;
  setReplies: (courseId: string, postId: string, items: PazzaReply[]) => void;
  setFolders: (courseId: string, items: PazzaFolder[]) => void;
  removePostData: (courseId: string, postId: string) => void;
};

const initialFolders = [...mockPazzaFolders, ...courses.filter(c => !mockPazzaFolders.some(f => f.courseId === c._id)).flatMap(c => defaultFolderNames.map((name, i) => ({ _id: `fixture-${c._id}-folder-${i + 1}`, courseId: c._id, name })))];
export const usePazzaStore = create<Store>((set) => ({
  answers: mockPazzaAnswers, discussions: mockPazzaDiscussions, replies: mockPazzaReplies, folders: initialFolders,
  setAnswers: (courseId, postId, items) => set(s => ({ answers: [...s.answers.filter(x => x.courseId !== courseId || x.postId !== postId), ...items] })),
  setDiscussions: (courseId, postId, items) => set(s => ({ discussions: [...s.discussions.filter(x => x.courseId !== courseId || x.postId !== postId), ...items] })),
  setReplies: (courseId, postId, items) => set(s => { const ids = new Set([...s.discussions.filter(x => x.courseId === courseId && x.postId === postId).map(x => x._id), ...items.map(x => x.discussionId)]); return { replies: [...s.replies.filter(x => !ids.has(x.discussionId)), ...items] }; }),
  setFolders: (courseId, items) => set(s => ({ folders: [...s.folders.filter(x => x.courseId !== courseId), ...items] })),
  removePostData: (courseId, postId) => set(s => { const ids = new Set(s.discussions.filter(x => x.courseId === courseId && x.postId === postId).map(x => x._id)); return { answers: s.answers.filter(x => x.courseId !== courseId || x.postId !== postId), discussions: s.discussions.filter(x => x.courseId !== courseId || x.postId !== postId), replies: s.replies.filter(x => !ids.has(x.discussionId)) }; }),
}));

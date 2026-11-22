/** Temporary UI-only fixtures. Never treat these as persistent or authoritative. */
import type {
  PazzaAnswer,
  PazzaCourse,
  PazzaDiscussion,
  PazzaFolder,
  PazzaPost,
  PazzaReply,
  PazzaUser,
} from "./types";

// IDs and roles correspond to existing Kambaz JSON entries in the a4 archive.
export const mockPazzaUsers: PazzaUser[] = [
  { _id: "123", firstName: "Tony", lastName: "Stark", role: "STUDENT" },
  { _id: "234", firstName: "Bruce", lastName: "Wayne", role: "STUDENT" },
  { _id: "678", firstName: "Nick", lastName: "Fury", role: "FACULTY" },
];

export const mockPazzaCourses: PazzaCourse[] = [
  { _id: "RS101", name: "Rocket Propulsion" },
  { _id: "RS102", name: "Aerodynamics" },
];

export const defaultFolderNames = [
  "hw1",
  "hw2",
  "hw3",
  "hw4",
  "hw5",
  "hw6",
  "project",
  "exam",
  "logistics",
  "other",
  "office_hours",
] as const;

export const mockPazzaFolders: PazzaFolder[] = [
  ...defaultFolderNames.map((name, index) => ({
    _id: `fixture-rs101-folder-${index + 1}`,
    courseId: "RS101",
    name,
  })),
  ...defaultFolderNames.map((name, index) => ({
    _id: `fixture-rs102-folder-${index + 1}`,
    courseId: "RS102",
    name,
  })),
];

export const mockPazzaPosts: PazzaPost[] = [
  {
    _id: "fixture-post-1",
    courseId: "RS101",
    authorId: "123",
    type: "QUESTION",
    audience: "ENTIRE_CLASS",
    recipientIds: [],
    folderIds: ["fixture-rs101-folder-1"],
    summary: "Question about homework 1",
    details: "<p>Could someone clarify the first problem?</p>",
    createdAt: "2026-11-21T18:00:00.000Z",
    updatedAt: "2026-11-21T18:00:00.000Z",
    viewCount: 3,
    readByUserIds: ["123"],
  },
  {
    _id: "fixture-post-2",
    courseId: "RS101",
    authorId: "234",
    type: "NOTE",
    audience: "SELECTED_USERS",
    recipientIds: ["678"],
    folderIds: ["fixture-rs101-folder-9"],
    summary: "Office hours scheduling note",
    details: "<p>Question for the instructor about availability.</p>",
    createdAt: "2026-11-20T15:00:00.000Z",
    updatedAt: "2026-11-20T15:00:00.000Z",
    viewCount: 1,
    readByUserIds: ["234"],
  },
  {
    _id: "fixture-post-3",
    courseId: "RS102",
    authorId: "123",
    type: "QUESTION",
    audience: "ENTIRE_CLASS",
    recipientIds: [],
    folderIds: ["fixture-rs102-folder-7"],
    summary: "Project discussion for RS102",
    details: "<p>What should we cover in our first meeting?</p>",
    createdAt: "2026-11-19T18:00:00.000Z",
    updatedAt: "2026-11-19T18:00:00.000Z",
    viewCount: 1,
    readByUserIds: [],
  },
];

export const mockPazzaAnswers: PazzaAnswer[] = [
  {
    _id: "fixture-answer-1",
    courseId: "RS101",
    postId: "fixture-post-1",
    authorId: "678",
    kind: "INSTRUCTOR",
    content: "<p>Start with the diagram in the assignment.</p>",
    createdAt: "2026-11-21T18:15:00.000Z",
    updatedAt: "2026-11-21T18:15:00.000Z",
  },
];

export const mockPazzaDiscussions: PazzaDiscussion[] = [
  {
    _id: "fixture-discussion-1",
    courseId: "RS101",
    postId: "fixture-post-1",
    authorId: "234",
    content: "I'm having the same difficulty.",
    resolved: false,
    createdAt: "2026-11-21T18:20:00.000Z",
    updatedAt: "2026-11-21T18:20:00.000Z",
  },
];

export const mockPazzaReplies: PazzaReply[] = [
  {
    _id: "fixture-reply-1",
    courseId: "RS101",
    discussionId: "fixture-discussion-1",
    parentReplyId: null,
    authorId: "123",
    content: "Let's compare our diagrams.",
    createdAt: "2026-11-21T18:25:00.000Z",
    updatedAt: "2026-11-21T18:25:00.000Z",
  },
  {
    _id: "fixture-reply-2",
    courseId: "RS101",
    discussionId: "fixture-discussion-1",
    parentReplyId: "fixture-reply-1",
    authorId: "234",
    content: "That would help, thanks.",
    createdAt: "2026-11-21T18:30:00.000Z",
    updatedAt: "2026-11-21T18:30:00.000Z",
  },
];

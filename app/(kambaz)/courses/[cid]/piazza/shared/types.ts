/** Shared Pazza data contracts. No API or database implementation. */

/** Kambaz currently uses string _id values for users and courses. */
export type PazzaId = string;
export type IsoDateTime = string; // ISO 8601 UTC timestamp, e.g. 2026-11-21T19:00:00.000Z

/** Retain existing Kambaz role labels; authorization policy is deferred. */
export type KambazRole = "STUDENT" | "TA" | "FACULTY" | "ADMIN";

/** Small, public user representation. Never expose password fields to Pazza UI. */
export interface PazzaUser {
  _id: PazzaId;
  firstName: string;
  lastName: string;
  role: KambazRole;
}

export interface PazzaCourse {
  _id: PazzaId;
  name: string;
}

export interface PazzaFolder {
  _id: PazzaId;
  courseId: PazzaId;
  name: string;
}

export type PostType = "QUESTION" | "NOTE";
export type PostAudience = "ENTIRE_CLASS" | "SELECTED_USERS";

export interface PazzaPost {
  _id: PazzaId;
  courseId: PazzaId;
  authorId: PazzaId;
  type: PostType;
  audience: PostAudience;
  /** Empty for ENTIRE_CLASS; member IDs for SELECTED_USERS. */
  recipientIds: PazzaId[];
  folderIds: PazzaId[]; // Must contain at least one folder on submission
  summary: string; // Required; maximum 100 characters
  details: string; // Rich-text editor content; content format chosen later
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  viewCount: number;
  /** Temporary UI fixture field; persistence strategy to be decided later. */
  readByUserIds: PazzaId[];
}

/** Answer sections are separate in the UI. */
export type AnswerKind = "STUDENT" | "INSTRUCTOR";

export interface PazzaAnswer {
  _id: PazzaId;
  courseId: PazzaId;
  postId: PazzaId;
  authorId: PazzaId;
  kind: AnswerKind;
  content: string; // Rich-text content format chosen later
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface PazzaDiscussion {
  _id: PazzaId;
  courseId: PazzaId;
  postId: PazzaId;
  authorId: PazzaId;
  content: string;
  resolved: boolean;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** A null parentReplyId means a direct reply to the discussion. */
export interface PazzaReply {
  _id: PazzaId;
  courseId: PazzaId;
  discussionId: PazzaId;
  parentReplyId: PazzaId | null;
  authorId: PazzaId;
  content: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

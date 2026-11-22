/** Type-only interface boundaries for independent UI work.
 * No components, API calls, stores, permissions, or rendering implemented here.
 */
import type {
  PazzaAnswer,
  PazzaCourse,
  PazzaDiscussion,
  PazzaFolder,
  PazzaId,
  PazzaPost,
  PazzaReply,
  PazzaUser,
} from "./types";

/** A adapts AccountContext.currentUser to PazzaUser (or null when signed out). */
export interface PazzaContext {
  course: PazzaCourse;
  currentUser: PazzaUser | null;
}

/** A owns the PostView container; B supplies its child sections. */
export interface AnswersProps extends PazzaContext {
  post: PazzaPost;
  answers: PazzaAnswer[];
  /** B's section requests a refreshed answer list after a successful change. */
  onAnswersChanged?: () => void;
}

export interface FollowUpDiscussionsProps extends PazzaContext {
  post: PazzaPost;
  discussions: PazzaDiscussion[];
  replies: PazzaReply[];
  /** B's section requests refreshed discussion/reply data after a change. */
  onDiscussionsChanged?: () => void;
}

/** A owns display, selection state, and post filtering; B owns folder data. */
export interface FolderFiltersProps {
  folders: PazzaFolder[];
  selectedFolderId: PazzaId | null; // null means All Folders
  onSelectFolder: (folderId: PazzaId | null) => void;
}

/** A owns the New Post form, which consumes the same B-owned folder records. */
export interface FolderSelectionProps {
  folders: PazzaFolder[];
  selectedFolderIds: PazzaId[];
  onChange: (folderIds: PazzaId[]) => void;
}

/** B owns the Manage Folders screen and its data mutations. */
export interface ManageFoldersProps extends PazzaContext {
  folders: PazzaFolder[];
  onFoldersChanged?: () => void;
}

/** B supplies answers to A's class statistics without A owning answer CRUD. */
export interface ClassAtAGlanceData {
  course: PazzaCourse;
  posts: PazzaPost[];
  answers: PazzaAnswer[];
  enrolledStudentCount: number;
  currentUser: PazzaUser | null;
}

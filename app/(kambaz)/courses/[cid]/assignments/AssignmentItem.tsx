import Link from "next/link";
import {
  FaFileAlt,
  FaGripVertical,
  FaCheckCircle,
  FaTrash,
} from "react-icons/fa";
import type { Assignment } from "../../../store/assignmentsStore";

export default function AssignmentItem({
  assignment,
  onDelete,
}: {
  assignment: Assignment;
  onDelete: () => void;
}) {
  return (
    <li className="wd-assignment-list-item flex items-center gap-3 border-t border-neutral-300 border-l-[4px] border-l-green-700 bg-white p-4">
      <FaGripVertical
        className="shrink-0 text-neutral-600"
        aria-hidden="true"
      />
      <FaFileAlt
        className="shrink-0 text-xl text-green-700"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <Link
          href={`/courses/${assignment.course}/assignments/${assignment._id}`}
          className="wd-assignment-link font-semibold text-neutral-800 no-underline"
        >
          {assignment.title}
        </Link>
        <div className="mt-1 text-sm text-neutral-600">
          <span className="text-red-700">Multiple Modules</span>
          {assignment.available && (
            <> &nbsp;|&nbsp; Available from {assignment.available}</>
          )}
          {assignment.due && <> &nbsp;|&nbsp; Due {assignment.due}</>}
          {assignment.until && <> &nbsp;|&nbsp; Until {assignment.until}</>}
          <> &nbsp;|&nbsp; {assignment.points} pts</>
        </div>
      </div>
      <FaCheckCircle className="shrink-0 text-green-700" aria-hidden="true" />
      <button
        type="button"
        className="rounded p-2 text-red-600 hover:bg-red-50"
        aria-label={`Delete ${assignment.title}`}
        title="Delete assignment"
        id="wd-delete-assignment-click"
        onClick={onDelete}
      >
        <FaTrash />
      </button>
    </li>
  );
}

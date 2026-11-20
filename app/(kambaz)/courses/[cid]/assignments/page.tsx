"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPlus, FaSearch, FaGripVertical, FaEllipsisV } from "react-icons/fa";
import AssignmentItem from "./AssignmentItem";
import { useAssignmentsStore } from "../../../store/assignmentsStore";

export default function Assignments() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const assignments = useAssignmentsStore((state) => state.assignments);
  const deleteAssignment = useAssignmentsStore(
    (state) => state.deleteAssignment,
  );
  const [search, setSearch] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const visibleAssignments = assignments.filter(
    (a) =>
      a.course === courseId &&
      a.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div id="wd-assignments">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-300 pb-5">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            placeholder="Search for Assignment"
            id="wd-search-assignment"
            className="w-full rounded border border-neutral-300 py-2 pr-3 pl-9 sm:w-72"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="wd-add-assignment-group"
            type="button"
            className="rounded border border-neutral-300 bg-neutral-100 px-3 py-2"
          >
            + Group
          </button>
          <Link
            href={`/courses/${courseId}/assignments/new`}
            id="wd-add-assignment"
            className="inline-flex items-center gap-2 rounded bg-red-700 px-3 py-2 font-medium text-white no-underline"
          >
            <FaPlus /> Assignment
          </Link>
          <FaEllipsisV className="text-neutral-600" aria-hidden="true" />
        </div>
      </div>

      <div className="border border-neutral-300">
        <div
          id="wd-assignments-title"
          className="flex items-center gap-3 bg-neutral-100 p-3 font-semibold text-neutral-800"
        >
          <FaGripVertical className="text-neutral-700" aria-hidden="true" />
          <span className="flex-1">ASSIGNMENTS</span>
          <span className="rounded-full border border-neutral-300 bg-white px-3 py-1 text-sm font-normal">
            40% of Total
          </span>
          <FaPlus className="text-neutral-500" aria-hidden="true" />
          <FaEllipsisV className="text-neutral-600" aria-hidden="true" />
        </div>
        <ul id="wd-assignment-list" className="m-0 list-none p-0">
          {visibleAssignments.map((assignment) => (
            <AssignmentItem
              key={assignment._id}
              assignment={assignment}
              onDelete={() => setPendingDeleteId(assignment._id)}
            />
          ))}
        </ul>
      </div>

      {pendingDeleteId !== null && (
        <div
          id="wd-delete-assignment-dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wd-delete-assignment-title"
            className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg"
          >
            <h3
              id="wd-delete-assignment-title"
              className="mb-3 text-lg font-semibold"
            >
              Delete assignment?
            </h3>
            <p className="mb-5">
              Are you sure you want to remove this assignment?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                id="wd-delete-assignment-cancel"
                className="rounded border border-neutral-300 px-4 py-2"
                onClick={() => setPendingDeleteId(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                id="wd-delete-assignment-confirm"
                className="rounded bg-red-700 px-4 py-2 text-white"
                onClick={() => {
                  deleteAssignment(pendingDeleteId);
                  setPendingDeleteId(null);
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

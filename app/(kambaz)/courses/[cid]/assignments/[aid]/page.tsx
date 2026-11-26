"use client";

import { useEffect, useState } from "react";
import * as client from "../../../client";
import { useParams, useRouter } from "next/navigation";
import {
  useAssignmentsStore,
  type Assignment,
} from "../../../../store/assignmentsStore";

const emptyAssignment = {
  title: "New Assignment",
  description: "New Assignment Description",
  points: 100,
  due: "",
  available: "",
  until: "",
};

export default function AssignmentEditor() {
  const { cid, aid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const assignmentId = typeof aid === "string" ? aid : "";
  return (
    <Editor
      key={`${courseId}-${assignmentId}`}
      courseId={courseId}
      assignmentId={assignmentId}
    />
  );
}

function Editor({
  courseId,
  assignmentId,
}: {
  courseId: string;
  assignmentId: string;
}) {
  const router = useRouter();
  const assignments = useAssignmentsStore((state) => state.assignments);
  const addAssignment = useAssignmentsStore((state) => state.addAssignment);
  const updateAssignment = useAssignmentsStore(
    (state) => state.updateAssignment,
  );
  const existing = assignments.find(
    (a) => a._id === assignmentId && a.course === courseId,
  );
  const creating = assignmentId === "new";
  const listUrl = `/courses/${courseId}/assignments`;

  const setAssignments = useAssignmentsStore((state) => state.setAssignments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    client
      .findAssignmentsForCourse(courseId)
      .then((data) => {
        if (active) setAssignments(data);
      })
      .catch(() => {
        if (active) {
          setAssignments([]);
          setError("Unable to load assignments");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [courseId, setAssignments]);

  if (loading) return <p>Loading assignment...</p>;
  if (error && !existing && !creating) return <p role="alert">{error}</p>;

  // Keying the form by the assignment ID gives each editor its own draft.
  if (!courseId || (!creating && !existing)) {
    return <p>Assignment not found.</p>;
  }

  return (
    <>
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      <AssignmentForm
        key={`${courseId}-${assignmentId}`}
        initialAssignment={
          existing ?? { ...emptyAssignment, _id: "", course: courseId }
        }
        onCancel={() => router.push(listUrl)}
        saving={saving}
        onSave={async (draft) => {
          if (saving) return;
          setSaving(true);
          setError("");
          try {
            if (creating) {
              const created = await client.createAssignmentForCourse(
                courseId,
                draft,
              );
              addAssignment(created);
            } else {
              const saved = await client.updateAssignment(draft);
              updateAssignment(saved);
            }
            router.push(listUrl);
          } catch {
            setError("Unable to save assignment");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
}

function AssignmentForm({
  initialAssignment,
  onCancel,
  onSave,
  saving,
}: {
  initialAssignment: Assignment;
  onCancel: () => void;
  onSave: (assignment: Assignment) => Promise<void>;
  saving: boolean;
}) {
  const [assignment, setAssignment] = useState<Assignment>(initialAssignment);
  const inputClass =
    "w-full rounded border border-neutral-300 bg-white px-3 py-2";

  return (
    <form
      id="wd-assignments-editor"
      onSubmit={(e) => {
        e.preventDefault();
        void onSave(assignment);
      }}
    >
      <label htmlFor="wd-name" className="mb-2 block font-medium">
        Assignment Name
      </label>
      <input
        id="wd-name"
        className={inputClass}
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
        required
      />

      <textarea
        id="wd-description"
        aria-label="Assignment description"
        className={`${inputClass} mt-4 min-h-36`}
        value={assignment.description}
        onChange={(e) =>
          setAssignment({ ...assignment, description: e.target.value })
        }
        rows={5}
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)]">
        <label htmlFor="wd-points" className="pt-2 sm:text-right">
          Points
        </label>
        <input
          id="wd-points"
          type="number"
          min="0"
          className={inputClass}
          value={assignment.points}
          onChange={(e) =>
            setAssignment({ ...assignment, points: Number(e.target.value) })
          }
        />

        <span className="pt-2 sm:text-right">Assign</span>
        <div className="rounded border border-neutral-300 p-4">
          <label htmlFor="wd-due-date" className="mb-1 block font-medium">
            Due
          </label>
          <input
            id="wd-due-date"
            type="date"
            className={inputClass}
            value={assignment.due}
            onChange={(e) =>
              setAssignment({ ...assignment, due: e.target.value })
            }
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="wd-available-from"
                className="mb-1 block font-medium"
              >
                Available from
              </label>
              <input
                id="wd-available-from"
                type="date"
                className={inputClass}
                value={assignment.available}
                onChange={(e) =>
                  setAssignment({ ...assignment, available: e.target.value })
                }
              />
            </div>
            <div>
              <label
                htmlFor="wd-available-until"
                className="mb-1 block font-medium"
              >
                Until
              </label>
              <input
                id="wd-available-until"
                type="date"
                className={inputClass}
                value={assignment.until ?? ""}
                onChange={(e) =>
                  setAssignment({ ...assignment, until: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-2 border-y border-neutral-300 py-4">
        <button
          type="button"
          id="wd-cancel"
          disabled={saving}
          onClick={onCancel}
          className="rounded border border-neutral-300 bg-neutral-100 px-4 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          id="wd-save"
          disabled={saving}
          className="rounded bg-red-700 px-4 py-2 font-medium text-white"
        >
          Save
        </button>
      </div>
    </form>
  );
}

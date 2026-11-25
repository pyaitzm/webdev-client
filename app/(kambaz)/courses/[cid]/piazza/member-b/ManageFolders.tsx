"use client";

import { useEffect, useState } from "react";
import type { ManageFoldersProps } from "../shared/componentContracts";
import type { PazzaFolder } from "../shared/types";

type Props = ManageFoldersProps;
const instructor = (role: string | undefined) =>
  ["FACULTY", "TA", "ADMIN"].includes(role ?? "");

/** Local-state version of the folder administration UI; persistence is added later. */
export default function ManageFolders({
  course,
  currentUser,
  folders,
  onFoldersChanged,
}: Props) {
  const [items, setItems] = useState(
    folders.filter((folder) => folder.courseId === course._id),
  );
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(
    () => setItems(folders.filter((folder) => folder.courseId === course._id)),
    [course._id, folders],
  );
  const canManage = instructor(currentUser?.role);
  const save = (next: PazzaFolder[]) => {
    setItems(next);
    onFoldersChanged?.();
  };
  if (!canManage)
    return (
      <section className="rounded border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <h2 className="font-semibold">Manage Folders</h2>
        <p className="mt-1 text-sm">
          Folder administration is available to instructors only.
        </p>
      </section>
    );
  return (
    <section
      id="wd-pazza-manage-folders"
      className="rounded border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="text-xl font-semibold">Manage Folders</h2>
      <p className="mt-1 text-sm text-slate-500">Folders for {course.name}</p>
      <div className="mt-4 flex gap-2">
        <input
          aria-label="New folder name"
          className="min-w-0 flex-1 rounded border border-slate-300 px-3 py-2"
          placeholder="New folder name"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="button"
          className="rounded bg-red-700 px-4 py-2 text-sm font-medium text-white"
          onClick={() => {
            const name = draft.trim();
            if (!name) return;
            save([
              ...items,
              {
                _id: `folder-${crypto.randomUUID()}`,
                courseId: course._id,
                name,
              },
            ]);
            setDraft("");
          }}
        >
          Add Folder
        </button>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          className="rounded border border-red-700 px-3 py-2 text-sm text-red-700 disabled:border-slate-300 disabled:text-slate-400"
          disabled={!selected.length}
          onClick={() => {
            save(items.filter((folder) => !selected.includes(folder._id)));
            setSelected([]);
          }}
        >
          Delete selected ({selected.length})
        </button>
      </div>
      <ul className="mt-3 divide-y rounded border border-slate-200">
        {items.map((folder) => (
          <li key={folder._id} className="flex items-center gap-3 p-3">
            <input
              type="checkbox"
              aria-label={`Select ${folder.name}`}
              checked={selected.includes(folder._id)}
              onChange={(event) =>
                setSelected(
                  event.target.checked
                    ? [...selected, folder._id]
                    : selected.filter((id) => id !== folder._id),
                )
              }
            />
            {editing === folder._id ? (
              <>
                <input
                  aria-label="Edit folder name"
                  className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1"
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                />
                <button
                  type="button"
                  className="text-sm text-red-700 underline"
                  onClick={() => {
                    const name = editValue.trim();
                    if (!name) return;
                    save(
                      items.map((item) =>
                        item._id === folder._id ? { ...item, name } : item,
                      ),
                    );
                    setEditing(null);
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="text-sm underline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className="min-w-0 flex-1">{folder.name}</span>
                <button
                  type="button"
                  className="text-sm text-red-700 underline"
                  onClick={() => {
                    setEditing(folder._id);
                    setEditValue(folder.name);
                  }}
                >
                  Edit
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

"use client";

import * as client from "./client";
import { useEffect, useState } from "react";

type Assignment = {
  id: number;
  title: string;
  description: string;
  due: string;
  completed: boolean;
  score: number;
};

export default function WorkingWithRemoteObjectsAsync() {
  const [assignment, setAssignment] = useState<Assignment | null>(null);

  const fetchAssignment = async () => {
    setAssignment(await client.fetchAssignment());
  };
  const updateTitle = async () => {
    if (!assignment) return;
    setAssignment(await client.updateTitle(assignment.title));
  };

  useEffect(() => {
    fetchAssignment();
  }, []);

  if (!assignment) {
    return <div id="wd-working-with-remote-objects-async">Loading...</div>;
  }

  return (
    <div id="wd-working-with-remote-objects-async">
      <h3>Working With Objects Asynchronously</h3>
      <h4>Assingment</h4>
      <input
        id="wd-assignment-title"
        value={assignment.title}
        onChange={(event) =>
          setAssignment({
            ...assignment,
            title: event.target.value,
          })
        }
      />

      <button
        id="wd-update-assignment-title"
        type="button"
        onClick={updateTitle}
        className="ml-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Title
      </button>

      <pre>{JSON.stringify(assignment, null, 2)}</pre>
    </div>
  );
}

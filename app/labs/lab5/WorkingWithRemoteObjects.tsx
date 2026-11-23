"use client";

import { useState } from "react";

export default function WorkingWithRemoteObjects() {
  const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
  const [assignment, setAssignment] = useState({
    id: 1,
    title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10",
    completed: false,
    score: 0,
  });
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const [module, setModule] = useState({
    id: "module-1",
    name: "RESTful APIs",
    description: "Learn how to build APIs with Express",
    course: "CS5610",
  });

  return (
    <div id="wd-working-with-remote-objects">
      <h4>Retrieving Objects</h4>
      <a
        id="wd-retrieve-assignments"
        href={`${HTTP_SERVER}/lab5/assignment`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Assignment
      </a>
      <h4>Retrieving Properties</h4>
      <a
        id="wd-retrieve-assignment-title"
        href={`${HTTP_SERVER}/lab5/assignment/title`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Title
      </a>
      <h4>Modifying Properties</h4>
      <a
        id="wd-update-assignment-title"
        href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Title
      </a>{" "}
      <input
        id="wd-assignment-title"
        value={assignment.title}
        onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })
        }
      />
      <h4>Module (On Your Own)</h4>
      <a
        id="wd-retrieve-module"
        href={`${HTTP_SERVER}/lab5/module`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Module
      </a>{" "}
      <a
        id="wd-retrieve-module-name"
        href={`${HTTP_SERVER}/lab5/module/name`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Get Module Name
      </a>
      <br />
      <br />
      <a
        id="wd-update-module-name"
        href={`${HTTP_SERVER}/lab5/module/name/${module.name}`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Module Name
      </a>{" "}
      <input
        id="wd-module-name"
        value={module.name}
        onChange={(e) => setModule({ ...module, name: e.target.value })}
      />{" "}
      <br />
      <br />
      <a
        id="wd-update-module-description"
        href={`${HTTP_SERVER}/lab5/module/description/${module.description}`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Module Description
      </a>{" "}
      <input
        id="wd-module-description"
        value={module.description}
        onChange={(e) => setModule({ ...module, description: e.target.value })}
      />{" "}
      <br />
      <br />
      <a
        id="wd-update-assignment-score"
        href={`${HTTP_SERVER}/lab5/assignment/score/${assignment.score}`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Score
      </a>{" "}
      <input
        id="wd-assignment-score"
        type="number"
        value={assignment.score}
        onChange={(e) =>
          setAssignment({ ...assignment, score: Number(e.target.value) })
        }
      />{" "}
      <br />
      <br />
      <a
        id="wd-update-assignment-completed"
        href={`${HTTP_SERVER}/lab5/assignment/completed/${assignment.completed}`}
        className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white"
      >
        Update Completed
      </a>{" "}
      <input
        id="wd-assignment-completed"
        type="checkbox"
        checked={assignment.completed}
        onChange={(e) =>
          setAssignment({ ...assignment, completed: e.target.checked })
        }
      />{" "}
    </div>
  );
}

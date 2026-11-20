"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import * as db from "../../../../database";
import { emptyUser, type User } from "../../../../account/AccountContext";
import { useEnrollmentsStore } from "../../../../store/enrollmentsStore";

export default function PeopleTable() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "";
  const [users, setUsers] = useState<User[]>(db.users);
  const [person, setPerson] = useState<User>({ ...emptyUser });
  const enrollments = useEnrollmentsStore((state) => state.enrollments);
  const enroll = useEnrollmentsStore((state) => state.enroll);
  const unenroll = useEnrollmentsStore((state) => state.unenroll);
  const enrolled = users.filter((user) =>
    enrollments.some((e) => e.user === user._id && e.course === courseId),
  );

  const addPerson = () => {
    if (!person.firstName.trim() || !person.lastName.trim() || !courseId)
      return;
    const newUser = { ...person, _id: crypto.randomUUID() };
    setUsers((previous) => [...previous, newUser]);
    enroll(newUser._id, courseId);
    setPerson({ ...emptyUser });
  };

  return (
    <div id="wd-people-table" className="overflow-x-auto">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          aria-label="First name"
          placeholder="First name"
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={person.firstName}
          onChange={(e) => setPerson({ ...person, firstName: e.target.value })}
        />
        <input
          aria-label="Last name"
          placeholder="Last name"
          className="rounded border border-neutral-300 px-3 py-1.5"
          value={person.lastName}
          onChange={(e) => setPerson({ ...person, lastName: e.target.value })}
        />
        <button
          type="button"
          className="rounded bg-blue-600 px-3 py-1.5 text-white"
          onClick={addPerson}
        >
          Add Person
        </button>
      </div>
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-300">
            <th className="p-2">Name</th>
            <th className="p-2">Login ID</th>
            <th className="p-2">Section</th>
            <th className="p-2">Role</th>
            <th className="p-2">Last Activity</th>
            <th className="p-2">Total Activity</th>
            <th className="p-2">Enrollment</th>
          </tr>
        </thead>
        <tbody>
          {enrolled.map((user) => (
            <tr key={user._id} className="odd:bg-neutral-50">
              <td className="wd-full-name p-2 text-nowrap">
                <FaUserCircle className="me-2 inline align-middle text-3xl text-neutral-500" />
                <span className="wd-first-name">{user.firstName}</span>{" "}
                <span className="wd-last-name">{user.lastName}</span>
              </td>
              <td className="wd-login-id p-2">{user.loginId}</td>
              <td className="wd-section p-2">{user.section}</td>
              <td className="wd-role p-2">{user.role}</td>
              <td className="wd-last-activity p-2">{user.lastActivity}</td>
              <td className="wd-total-activity p-2">{user.totalActivity}</td>
              <td className="p-2">
                <button
                  type="button"
                  className="rounded bg-red-600 px-2 py-1 text-white"
                  onClick={() => unenroll(user._id, courseId)}
                >
                  Unenroll
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
